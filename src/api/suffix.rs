use actix_web::{post, web, get, delete, Responder};
use entity::po::{suffix, suffix_meaning, suffix_category};
use sea_orm::{ActiveValue, ActiveModelTrait, EntityTrait, QueryOrder, QuerySelect, QueryFilter, ColumnTrait, TransactionTrait};
use serde::{Deserialize, Serialize};
use super::{ApiState, Response, HttpResult};

#[derive(Deserialize)]
struct NewSuffixCategory {
    text: String,
    detail: Option<String>,
}

#[get("/suffix/category/new")]
async fn new_suffix_category(ctx: web::Data<ApiState>, arg: web::Json<NewSuffixCategory>) -> HttpResult<impl Responder> {
    let cat = suffix_category::ActiveModel{
        id: ActiveValue::NotSet,
        text: ActiveValue::Set(arg.text.clone()),
        detail: match arg.detail.as_ref() {
            Some(d) => ActiveValue::Set(d.clone()),
            None => ActiveValue::NotSet,
        },
    };
    let cat = cat.save(ctx.db.as_ref()).await?;
    Ok(web::Json(Response::<i32>::none()))
}


#[derive(Deserialize, Serialize, Debug)]
struct SuffixArg {
    sign: String,
    category: i32,
    ///
    meaning: Vec<String>,
    origin: Option<String>,
    stem: Option<i32>,
    desc: Option<String>,
}

#[post("/suffix/new")]
async fn new_suffix(ctx: web::Data<ApiState>, suffix_arg: web::Json<SuffixArg>) -> web::Json<Response<()>> {
    println!("arg: {:?}", suffix_arg);
    if suffix_arg.meaning.len() == 0 {
        let resp = Response::err(error::Error::ArgError("meaning is required".into()));
        return web::Json(resp);
    }
    let result = ctx.db.as_ref().transaction::<_, (), sea_orm::DbErr>(|tx| {
        Box::pin(async move {
            let result = suffix::ActiveModel{
                id: ActiveValue::NotSet,
                sign: ActiveValue::Set(suffix_arg.sign.clone()),
                category: ActiveValue::Set(suffix_arg.category),
                stem: match suffix_arg.stem {
                    Some(v) => ActiveValue::Set(Some(v)),
                    None => ActiveValue::NotSet,
                },
                desc: match suffix_arg.desc.as_ref() {
                    Some(v) => ActiveValue::Set(Some(v.clone())),
                    None => ActiveValue::NotSet,
                },
                origin: match suffix_arg.origin.as_ref() {
                    Some(v) => ActiveValue::Set(Some(v.clone()  )),
                    None =>ActiveValue::NotSet,
                },
            }.save(tx).await?;

            let id = result.id.unwrap();
            for m in suffix_arg.meaning.iter() {
                suffix_meaning::ActiveModel{
                    id: ActiveValue::NotSet,
                    suffix_id: ActiveValue::Set(id),
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
struct SuffixInfo<'a> {
    id: i32,
    sign: String,
    meaning: Vec<String>,
    stem: Option<&'a SuffixInfo<'a>>,
}

#[derive(Serialize)]
struct ListResp<'a>(Vec<SuffixInfo<'a>>);


#[get("/suffix/list")]
async fn list_suffix(ctx: web::Data<ApiState>, list_arg: web::Query<ListArg>) -> Result<impl Responder, error::Error> {
    use suffix::Entity as Suffix;
    use suffix_meaning::Entity as SuffixMeaning;
    let mut query = Suffix::find()
        .find_with_related(SuffixMeaning)
        .order_by_asc(suffix::Column::Id)
        .limit(list_arg.limit);
    if list_arg.handle.is_some() {
        query = query.filter(suffix::Column::Id.gt(list_arg.handle.unwrap()));
    }
    let list: Vec<(suffix::Model, Vec<suffix_meaning::Model>)> = query.all(ctx.db.as_ref()).await?;
    let list: Vec<SuffixInfo<'_>> = list.iter().map(|m| {
        let mut item = SuffixInfo{
            id: m.0.id,
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

#[derive(Deserialize)]
struct DelSuffix {
    id: i32,
}

#[delete("/suffix/delete")]
async fn delete_suffix(ctx: web::Data<ApiState>, arg: web::Query<DelSuffix>) -> Result<impl Responder, error::Error> {
    println!("delete suffix: {:?}", &arg.id);
    suffix::Entity::delete_by_id(arg.id).exec(ctx.db.as_ref()).await?;
    Ok(web::Json(Response::<u64>::err(error::Error::Ok)))
}