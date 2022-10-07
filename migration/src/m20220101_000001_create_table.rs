use sea_orm_migration::{prelude::*, sea_orm::{EnumIter, DeriveActiveEnum}};
use sea_orm;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();
        manager
            .create_table(
                Table::create()
                    .table(Prefix::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Prefix::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()   
                    )
                    .col(ColumnDef::new(Prefix::Sign).string().not_null().unique_key())
                    .col(ColumnDef::new(Prefix::Stem).integer().null())
                    .col(ColumnDef::new(Prefix::Origin).string().null())
                    .col(ColumnDef::new(Prefix::Desc).string().null())
                    .to_owned()
            )
            .await?;
        manager
            .create_table(
                Table::create()
                    .table(PrefixMeaning::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PrefixMeaning::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                    )
                    .col(ColumnDef::new(PrefixMeaning::PrefixId).integer().not_null())
                    .col(ColumnDef::new(PrefixMeaning::Content).string().not_null())
                    .to_owned()
            ).await?;
        manager.create_foreign_key(ForeignKey::create()
            .from(PrefixMeaning::Table, PrefixMeaning::PrefixId)
            .to(Prefix::Table, Prefix::Id)
            .on_delete(ForeignKeyAction::Cascade)
            .to_owned()
        ).await?;
    

        manager
            .create_table(
                Table::create()
                    .table(Suffix::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Suffix::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()   
                    )
                    .col(ColumnDef::new(Suffix::Sign).string().not_null())
                    .col(ColumnDef::new(Suffix::Stem).integer().null())
                    .col(ColumnDef::new(Suffix::Origin).string().null())
                    .col(ColumnDef::new(Suffix::Desc).string().null())
                    .col(ColumnDef::new(Suffix::Category).integer().not_null())
                    .to_owned()
            )
            .await?;
        manager
            .create_table(
                Table::create()
                    .table(SuffixMeaning::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SuffixMeaning::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                    )
                    .col(ColumnDef::new(SuffixMeaning::SuffixId).integer().not_null())
                    .col(ColumnDef::new(SuffixMeaning::Content).string().not_null())
                    .to_owned()
            ).await?;
        manager.create_foreign_key(ForeignKey::create()
            .from(SuffixMeaning::Table, SuffixMeaning::SuffixId)
            .to(Suffix::Table, Suffix::Id)
            .on_delete(ForeignKeyAction::Cascade)
            .to_owned()
        ).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager.drop_table(Table::drop().table(Prefix::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(PrefixMeaning::Table).to_owned()).await?;
        Ok(())
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
pub enum Prefix {
    Table,
    Id,
    /// signature for prefix
    Sign,
    Stem,
    Origin,
    Desc,
}

#[derive(Iden)]
pub enum PrefixMeaning {
    Table,
    Id,
    PrefixId,
    ///
    Content,
}

#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum SuffixCategory {
    Noun = 0,
    Verb = 1,
}

#[derive(Iden)]
pub enum Suffix {
    Table,
    Id,
    /// signature for prefix
    Sign,
    Stem,
    Origin,
    Category,
    Desc,
}

#[derive(Iden)]
pub enum SuffixMeaning {
    Table,
    Id,
    SuffixId,
    ///
    Content,
}
