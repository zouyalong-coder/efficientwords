use actix_web::{get, web, Responder, post};
use entity::po::{prefix, prefix_meaning};
use json::object;
use sea_orm::{ActiveValue::{NotSet, self}, TransactionTrait, ActiveModelTrait};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
// use error::Result;

#[derive(Serialize)]
struct Response<T> {
    error: error::Error,
    data: Option<T>,
}

impl<T> Response<T> {
    fn ok(data: T) -> Self {
        Self { error: error::Error::Ok, data: Some(data) }
    }

    fn err(err: error::Error) -> Self {
        Self{error: err, data: None}
    }
}

#[derive(Clone)]
pub struct ApiState {
    pub db: Arc<sea_orm::DatabaseConnection>,
}


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
    // let ctx = ApiState{
    //     db: Arc::new(sea_orm::Database::connect("postgresql://postgres:example@127.0.0.1:5432/words").await.unwrap()),
    // };
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