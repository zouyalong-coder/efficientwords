//! SeaORM Entity. Generated by sea-orm-codegen 0.9.3

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "suffix")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub sign: String,
    pub stem: Option<i32>,
    pub origin: Option<String>,
    pub desc: Option<String>,
    pub category: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
