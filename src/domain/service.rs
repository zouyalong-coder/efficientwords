use entity::po::prefix;

use super::infra;
use lazy_static::lazy_static;
// #[macro_use]
// extern crate lazy_static;


pub struct WordService {
    repo: Box<dyn infra::Repo + 'static>,
}

unsafe impl Sync for WordService{}


impl WordService {
    pub fn new() -> Self {
        let rt = tokio::runtime::Runtime::new()
            .unwrap();
        let repo = rt.block_on(async {
            crate::infra::Repo::new().await.unwrap()
        });
        Self {
            repo: Box::new(repo),
        }
    }

    pub async fn insert_prefix(&mut self, ent: prefix::ActiveModel) -> error::Result<prefix::ActiveModel> {
        self.repo.save_prefix(ent).await
    }
}

lazy_static!{
    pub static ref WSERVICE: WordService = WordService::new();
}
// pub static WService: WordService = WordService::new();