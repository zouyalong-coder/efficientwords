use actix_web::{get, web, Responder, post, Result, HttpResponse};
use entity::po::{prefix, prefix_meaning};
use sea_orm::{TransactionTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect, ColumnTrait};
use sea_orm::{ActiveValue, ActiveModelTrait};
use serde::{Deserialize, Serialize, self};
use super::ApiState;
use super::Response;

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("hello {name}!")
}

#[derive(Deserialize, Serialize, Debug)]
struct PrefixArg {
    sign: String,
    ///
    meaning: Vec<String>,
    origin: Option<String>,
    stem: Option<i32>,
    desc: Option<String>,
}

#[post("/prefix/new")]
async fn new_prefix(ctx: web::Data<ApiState>, prefix_arg: web::Json<PrefixArg>) -> web::Json<Response<()>> {
    println!("arg: {:?}", prefix_arg);
    if prefix_arg.meaning.len() == 0 {
        let resp = Response::err(error::Error::ArgError("meaning is required".into()));
        return web::Json(resp);
    }
    let result = ctx.db.as_ref().transaction::<_, (), sea_orm::DbErr>(|tx| {
        Box::pin(async move {
            let result = prefix::ActiveModel{
                id: ActiveValue::NotSet,
                sign: ActiveValue::Set(prefix_arg.sign.clone()),
                stem: match prefix_arg.stem {
                    Some(v) => ActiveValue::Set(Some(v)),
                    None => ActiveValue::NotSet,
                },
                desc: match prefix_arg.desc.as_ref() {
                    Some(v) => ActiveValue::Set(Some(v.clone())),
                    None => ActiveValue::NotSet,
                },
                origin: match prefix_arg.origin.as_ref() {
                    Some(v) => ActiveValue::Set(Some(v.clone()  )),
                    None =>ActiveValue::NotSet,
                },
            }.save(tx).await?;

            let id = result.id.unwrap();
            for m in prefix_arg.meaning.iter() {
                prefix_meaning::ActiveModel{
                    id: ActiveValue::NotSet,
                    prefix_id: ActiveValue::Set(id),
                    content: ActiveValue::Set(m.clone()),
                }.save(tx).await?;
            }

            Ok(())
        })
    }).await;
    let res: Response<()> = match result {
        Ok(_) => Response::err(error::Error::Ok),
        Err(e) => {
            match e {
                sea_orm::TransactionError::Connection(e) => Response::err(error::Error::DbError(e)),
                sea_orm::TransactionError::Transaction(e) => Response::err(error::Error::DbError(e)),
            }
        },
    };
    web::Json(res)
}

fn default_limit() -> u64 {
    10
}
#[derive(Deserialize)]
struct ListArg {
    #[serde(default = "default_limit")]
    limit: u64,
    handle: Option<u64>,
}

#[derive(Serialize)]
struct PrefixInfo<'a> {
    sign: String,
    meaning: Vec<String>,
    stem: Option<&'a PrefixInfo<'a>>,
}

#[derive(Serialize)]
struct ListResp<'a>(Vec<PrefixInfo<'a>>);


#[get("/prefix/list")]
async fn list_prefix(ctx: web::Data<ApiState>, list_arg: web::Query<ListArg>) -> Result<impl Responder, error::Error> {
    use prefix::Entity as Prefix;
    use prefix_meaning::Entity as PrefixMeaning;
    let mut query = Prefix::find()
        .find_with_related(PrefixMeaning)
        .order_by_asc(prefix::Column::Id)
        .limit(list_arg.limit);
    if list_arg.handle.is_some() {
        query = query.filter(prefix::Column::Id.gt(list_arg.handle.unwrap()));
    }
    let list: Vec<(prefix::Model, Vec<prefix_meaning::Model>)> = query.all(ctx.db.as_ref()).await?;
    let list: Vec<PrefixInfo<'_>> = list.iter().map(|m| {
        let mut item = PrefixInfo{
            sign: m.0.sign.clone(),
            stem: None,
            meaning: vec![],
        };
        for each in m.1.iter() {
            item.meaning.push(each.content.clone());
        }
        item
    }).collect();
    Ok(web::Json(ListResp(list)))
}