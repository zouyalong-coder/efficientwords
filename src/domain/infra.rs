use entity::po::prefix;


#[async_trait::async_trait]
pub trait Repo {
    async fn save_prefix(&mut self, inst: prefix::ActiveModel) -> error::Result<prefix::ActiveModel>;
}