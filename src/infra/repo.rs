use sea_orm::{Database, DatabaseConnection, ConnectOptions, ActiveModelTrait};
use entity::po::prefix;

use crate::domain::infra;

pub struct Repo {
    db: DatabaseConnection,
}

impl Repo {
    pub async fn new() -> error::Result<Self> {
        let mut opt = ConnectOptions::new("postgresql://postgres:example@127.0.0.1:5432/words".into());
        opt.max_connections(100)
            .sqlx_logging(true)
            .sqlx_logging_level(log::LevelFilter::Info)
            ;
        let db = Database::connect(opt).await?;
        // let db = Database::connect("postgresql://postgres:example@127.0.0.1:5432/words").await?;
        Ok(Self { db })
    }
}


#[async_trait::async_trait]
impl infra::Repo for Repo {
    async fn save_prefix(&mut self, inst: prefix::ActiveModel) -> error::Result<prefix::ActiveModel> {
        let a = inst.save(&self.db).await?;
        Ok(a)
    }
}