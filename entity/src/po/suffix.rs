//! SeaORM Entity. Generated by sea-orm-codegen 0.9.3

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "suffix"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel)]
pub struct Model {
    pub id: i32,
    pub sign: String,
    pub stem: Option<i32>,
    pub origin: Option<String>,
    pub desc: Option<String>,
    pub category: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Sign,
    Stem,
    Origin,
    Desc,
    Category,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i32;
    fn auto_increment() -> bool {
        true
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    SuffixCategory,
    SuffixMeaning,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Sign => ColumnType::String(None).def(),
            Self::Stem => ColumnType::Integer.def().null(),
            Self::Origin => ColumnType::String(None).def().null(),
            Self::Desc => ColumnType::String(None).def().null(),
            Self::Category => ColumnType::Integer.def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::SuffixCategory => Entity::belongs_to(super::suffix_category::Entity)
                .from(Column::Category)
                .to(super::suffix_category::Column::Id)
                .into(),
            Self::SuffixMeaning => Entity::has_many(super::suffix_meaning::Entity).into(),
        }
    }
}

impl Related<super::suffix_category::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SuffixCategory.def()
    }
}

impl Related<super::suffix_meaning::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::SuffixMeaning.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
