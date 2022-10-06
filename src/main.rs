mod api;
mod domain;
mod infra;
use std::sync::Arc;


use actix_web::{HttpServer, App, web, HttpResponse};
use api::ApiState;


#[tokio::main]
async fn main() -> std::io::Result<()> {
    let db = sea_orm::Database::connect("postgresql://postgres:example@127.0.0.1:5432/words").await.unwrap();
    let state = ApiState{
        db: Arc::new(db),
    };
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .service(api::greet)
            .service(api::new_prefix)
            .default_service(web::to(|| HttpResponse::NotFound()))
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
