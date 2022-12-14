mod prefix;
mod suffix;

use actix_web::Result;
pub use prefix::*;
pub use suffix::*;

use serde::{Serialize};
use std::sync::Arc;

#[derive(Serialize)]
struct Response<T> {
    error: error::Error,
    data: Option<T>,
}

impl<T> Response<T> {
    fn ok(data: T) -> Self {
        Self { error: error::Error::Ok, data: Some(data) }
    }

    fn none() -> Self {
        Self { error: error::Error::Ok, data: None }
    }

    fn err(err: error::Error) -> Self {
        Self{error: err, data: None}
    }
}

#[derive(Clone)]
pub struct ApiState {
    pub db: Arc<sea_orm::DatabaseConnection>,
}

type HttpResult<T> = Result<T, error::Error>;
