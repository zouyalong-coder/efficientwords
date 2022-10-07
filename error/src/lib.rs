use std::{error, fmt::Display};
use serde::{Serialize, ser::SerializeStruct, Deserialize};


#[derive(Debug)]
pub enum Error {
    Ok,
    /// client error
    ArgError(String),
    /// io error
    IO(std::io::Error),
    RecordMissing,
    DbError(sea_orm::DbErr),
    /// unknown
    Unknown(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            match self {
                Self::Ok => {
                    let mut s = serializer.serialize_struct("error", 1)?;
                    s.serialize_field("code", "ok")?;
                    s.end()
                },
                Self::RecordMissing => {
                    let mut s = serializer.serialize_struct("error", 1)?;
                    s.serialize_field("code", "not_found")?;
                    s.end()
                },
                Self::ArgError(c) => {
                    let mut s = serializer.serialize_struct("error", 2)?;
                    s.serialize_field("code", "arg_error")?;
                    s.serialize_field("detail", c)?;
                    s.end() 
                }
                Self::IO(e) => {
                    let mut s = serializer.serialize_struct("error".into(), 2)?;
                    s.serialize_field("code", "io")?;
                    s.serialize_field("detail", &e.to_string())?;
                    s.end()
                },
                Self::DbError(e) => {
                    let mut s = serializer.serialize_struct("error".into(), 2)?;
                    s.serialize_field("code", "db")?;
                    s.serialize_field("detail", &e.to_string())?;
                    s.end() 
                },
                Self::Unknown(cause) => {
                    let mut s = serializer.serialize_struct("error".into(), 2)?;
                    s.serialize_field("code", "unknown")?;
                    s.serialize_field("detail", cause)?;
                    s.end()  
                },
            }
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl error::Error for Error {}

impl From<std::io::Error> for Error {
    fn from(inner: std::io::Error) -> Self {
        Self::IO(inner)
    }
}

impl From<sea_orm::DbErr> for Error {
    fn from(e: sea_orm::DbErr) -> Self {
        match e {
            sea_orm::DbErr::RecordNotFound(_) => Self::RecordMissing,
            _ => Self::DbError(e),
        }
        
    }
}

impl actix_web::ResponseError for Error {
    fn status_code(&self) -> actix_web::http::StatusCode {
        use actix_web::http::*;
        match *self {
            Self::Ok => StatusCode::OK,
            Self::ArgError(_) => StatusCode::BAD_REQUEST,
            Self::RecordMissing => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;

#[cfg(test)]
mod tests {
    use super::*;

}
