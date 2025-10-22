{
  "openapi": "3.0.0",
  "info": {
    "title": "API documentation for 41300_indie_comments_v2",
    "version": "1.0.0",
    "description": "API documentation for 41300_indie_comments_v2"
  },
  "servers": [
    {
      "url": "https://openapi.nocodebackend.com"
    }
  ],
  "paths": {
    "/create/comments?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Create a new record in comments",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "thread_id": {
                    "type": "integer"
                  },
                  "author_name": {
                    "type": "string"
                  },
                  "author_email": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  },
                  "visible": {
                    "type": "integer"
                  },
                  "ip_address": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              },
              "examples": {
                "example": {
                  "summary": "Fill dropdowns using the enum options",
                  "value": {
                    "thread_id": 1,
                    "author_name": "string",
                    "author_email": "string",
                    "message": "string",
                    "visible": 1,
                    "ip_address": "string",
                    "created_at": "2025-10-22T14:39:42.202Z"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Successfully created the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "example": "success"
                    },
                    "message": {
                      "type": "string",
                      "example": "Record created successfully"
                    },
                    "id": {
                      "type": "integer",
                      "description": "ID of the newly created record"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/comments?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve all records from comments",
        "description": "### Filtering and query options\n\nUse query parameters to filter results. Operators use bracket notation:\n\n| Operator | Example | Meaning |\n|---|---|---|\n| `field` | `?status=active` | Equal (default) |\n| `field[ne]` | `?status[ne]=inactive` | Not equal |\n| `field[gt]` | `?price[gt]=100` | Greater than |\n| `field[gte]` | `?date[gte]=2024-05-01` | Greater than or equal |\n| `field[lt]` | `?score[lt]=500` | Less than |\n| `field[lte]` | `?score[lte]=800` | Less than or equal |\n| `field[in]` | `?type[in]=a,b,c` | In list (comma-separated) |\n| `field[like]` | `?name[like]=john` | Partial match |\n\n**Examples**\n- `?price[gte]=100&price[lte]=200`\n- `?name[like]=john`\n- `?status=active`\n\n**Additional helpers**\n- **Pagination**: `page`, `limit` (defaults 1, 10)\n- **Totals**: `includeTotal=true` adds `total` and `totalPages`\n- **Sorting**: `sort=colA,colB`, `order=asc,desc`\n- **Single record**: `only=latest` or `only=oldest` (optional `by=column`, defaults `id`)",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "thread_id": {
                            "type": "integer"
                          },
                          "author_name": {
                            "type": "string"
                          },
                          "author_email": {
                            "type": "string"
                          },
                          "message": {
                            "type": "string"
                          },
                          "visible": {
                            "type": "integer"
                          },
                          "ip_address": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/comments/{id}?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve a record by ID from comments",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to retrieve"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "thread_id": {
                          "type": "integer"
                        },
                        "author_name": {
                          "type": "string"
                        },
                        "author_email": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        },
                        "visible": {
                          "type": "integer"
                        },
                        "ip_address": {
                          "type": "string"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/search/comments?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Search for records in comments",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "thread_id": {
                    "type": "integer"
                  },
                  "author_name": {
                    "type": "string"
                  },
                  "author_email": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  },
                  "visible": {
                    "type": "integer"
                  },
                  "ip_address": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved matching records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "thread_id": {
                            "type": "integer"
                          },
                          "author_name": {
                            "type": "string"
                          },
                          "author_email": {
                            "type": "string"
                          },
                          "message": {
                            "type": "string"
                          },
                          "visible": {
                            "type": "integer"
                          },
                          "ip_address": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/update/comments/{id}?Instance=41300_indie_comments_v2": {
      "put": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Update a record in comments",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "thread_id": {
                    "type": "integer"
                  },
                  "author_name": {
                    "type": "string"
                  },
                  "author_email": {
                    "type": "string"
                  },
                  "message": {
                    "type": "string"
                  },
                  "visible": {
                    "type": "integer"
                  },
                  "ip_address": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully updated the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/delete/comments/{id}?Instance=41300_indie_comments_v2": {
      "delete": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Delete a record from comments",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to delete"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully deleted the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/create/sites?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Create a new record in sites",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": {
                    "type": "integer"
                  },
                  "site_url": {
                    "type": "string"
                  },
                  "site_name": {
                    "type": "string"
                  },
                  "api_key": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              },
              "examples": {
                "example": {
                  "summary": "Fill dropdowns using the enum options",
                  "value": {
                    "user_id": 1,
                    "site_url": "string",
                    "site_name": "string",
                    "api_key": "string",
                    "created_at": "2025-10-22T14:39:42.203Z"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Successfully created the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "example": "success"
                    },
                    "message": {
                      "type": "string",
                      "example": "Record created successfully"
                    },
                    "id": {
                      "type": "integer",
                      "description": "ID of the newly created record"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/sites?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve all records from sites",
        "description": "### Filtering and query options\n\nUse query parameters to filter results. Operators use bracket notation:\n\n| Operator | Example | Meaning |\n|---|---|---|\n| `field` | `?status=active` | Equal (default) |\n| `field[ne]` | `?status[ne]=inactive` | Not equal |\n| `field[gt]` | `?price[gt]=100` | Greater than |\n| `field[gte]` | `?date[gte]=2024-05-01` | Greater than or equal |\n| `field[lt]` | `?score[lt]=500` | Less than |\n| `field[lte]` | `?score[lte]=800` | Less than or equal |\n| `field[in]` | `?type[in]=a,b,c` | In list (comma-separated) |\n| `field[like]` | `?name[like]=john` | Partial match |\n\n**Examples**\n- `?price[gte]=100&price[lte]=200`\n- `?name[like]=john`\n- `?status=active`\n\n**Additional helpers**\n- **Pagination**: `page`, `limit` (defaults 1, 10)\n- **Totals**: `includeTotal=true` adds `total` and `totalPages`\n- **Sorting**: `sort=colA,colB`, `order=asc,desc`\n- **Single record**: `only=latest` or `only=oldest` (optional `by=column`, defaults `id`)",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "user_id": {
                            "type": "integer"
                          },
                          "site_url": {
                            "type": "string"
                          },
                          "site_name": {
                            "type": "string"
                          },
                          "api_key": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/sites/{id}?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve a record by ID from sites",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to retrieve"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "user_id": {
                          "type": "integer"
                        },
                        "site_url": {
                          "type": "string"
                        },
                        "site_name": {
                          "type": "string"
                        },
                        "api_key": {
                          "type": "string"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/search/sites?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Search for records in sites",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": {
                    "type": "integer"
                  },
                  "site_url": {
                    "type": "string"
                  },
                  "site_name": {
                    "type": "string"
                  },
                  "api_key": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved matching records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "user_id": {
                            "type": "integer"
                          },
                          "site_url": {
                            "type": "string"
                          },
                          "site_name": {
                            "type": "string"
                          },
                          "api_key": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/update/sites/{id}?Instance=41300_indie_comments_v2": {
      "put": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Update a record in sites",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "user_id": {
                    "type": "integer"
                  },
                  "site_url": {
                    "type": "string"
                  },
                  "site_name": {
                    "type": "string"
                  },
                  "api_key": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully updated the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/delete/sites/{id}?Instance=41300_indie_comments_v2": {
      "delete": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Delete a record from sites",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to delete"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully deleted the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/create/threads?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Create a new record in threads",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "site_id": {
                    "type": "integer"
                  },
                  "page_identifier": {
                    "type": "string"
                  },
                  "page_title": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              },
              "examples": {
                "example": {
                  "summary": "Fill dropdowns using the enum options",
                  "value": {
                    "site_id": 1,
                    "page_identifier": "string",
                    "page_title": "string",
                    "created_at": "2025-10-22T14:39:42.203Z"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Successfully created the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "example": "success"
                    },
                    "message": {
                      "type": "string",
                      "example": "Record created successfully"
                    },
                    "id": {
                      "type": "integer",
                      "description": "ID of the newly created record"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/threads?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve all records from threads",
        "description": "### Filtering and query options\n\nUse query parameters to filter results. Operators use bracket notation:\n\n| Operator | Example | Meaning |\n|---|---|---|\n| `field` | `?status=active` | Equal (default) |\n| `field[ne]` | `?status[ne]=inactive` | Not equal |\n| `field[gt]` | `?price[gt]=100` | Greater than |\n| `field[gte]` | `?date[gte]=2024-05-01` | Greater than or equal |\n| `field[lt]` | `?score[lt]=500` | Less than |\n| `field[lte]` | `?score[lte]=800` | Less than or equal |\n| `field[in]` | `?type[in]=a,b,c` | In list (comma-separated) |\n| `field[like]` | `?name[like]=john` | Partial match |\n\n**Examples**\n- `?price[gte]=100&price[lte]=200`\n- `?name[like]=john`\n- `?status=active`\n\n**Additional helpers**\n- **Pagination**: `page`, `limit` (defaults 1, 10)\n- **Totals**: `includeTotal=true` adds `total` and `totalPages`\n- **Sorting**: `sort=colA,colB`, `order=asc,desc`\n- **Single record**: `only=latest` or `only=oldest` (optional `by=column`, defaults `id`)",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "site_id": {
                            "type": "integer"
                          },
                          "page_identifier": {
                            "type": "string"
                          },
                          "page_title": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/threads/{id}?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve a record by ID from threads",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to retrieve"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "site_id": {
                          "type": "integer"
                        },
                        "page_identifier": {
                          "type": "string"
                        },
                        "page_title": {
                          "type": "string"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/search/threads?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Search for records in threads",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "site_id": {
                    "type": "integer"
                  },
                  "page_identifier": {
                    "type": "string"
                  },
                  "page_title": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved matching records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "site_id": {
                            "type": "integer"
                          },
                          "page_identifier": {
                            "type": "string"
                          },
                          "page_title": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/update/threads/{id}?Instance=41300_indie_comments_v2": {
      "put": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Update a record in threads",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "site_id": {
                    "type": "integer"
                  },
                  "page_identifier": {
                    "type": "string"
                  },
                  "page_title": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully updated the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/delete/threads/{id}?Instance=41300_indie_comments_v2": {
      "delete": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Delete a record from threads",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to delete"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully deleted the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/create/users?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Create a new record in users",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "password_hash": {
                    "type": "string"
                  },
                  "plan": {
                    "type": "string",
                    "enum": [
                      "free",
                      "paid"
                    ],
                    "description": "dropdown: choose one of [free, paid]"
                  },
                  "payment_proof": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              },
              "examples": {
                "example": {
                  "summary": "Fill dropdowns using the enum options",
                  "value": {
                    "name": "string",
                    "email": "string",
                    "password_hash": "string",
                    "plan": "free",
                    "payment_proof": "string",
                    "created_at": "2025-10-22T14:39:42.203Z"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Successfully created the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "example": "success"
                    },
                    "message": {
                      "type": "string",
                      "example": "Record created successfully"
                    },
                    "id": {
                      "type": "integer",
                      "description": "ID of the newly created record"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/users?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve all records from users",
        "description": "### Filtering and query options\n\nUse query parameters to filter results. Operators use bracket notation:\n\n| Operator | Example | Meaning |\n|---|---|---|\n| `field` | `?status=active` | Equal (default) |\n| `field[ne]` | `?status[ne]=inactive` | Not equal |\n| `field[gt]` | `?price[gt]=100` | Greater than |\n| `field[gte]` | `?date[gte]=2024-05-01` | Greater than or equal |\n| `field[lt]` | `?score[lt]=500` | Less than |\n| `field[lte]` | `?score[lte]=800` | Less than or equal |\n| `field[in]` | `?type[in]=a,b,c` | In list (comma-separated) |\n| `field[like]` | `?name[like]=john` | Partial match |\n\n**Examples**\n- `?price[gte]=100&price[lte]=200`\n- `?name[like]=john`\n- `?status=active`\n\n**Additional helpers**\n- **Pagination**: `page`, `limit` (defaults 1, 10)\n- **Totals**: `includeTotal=true` adds `total` and `totalPages`\n- **Sorting**: `sort=colA,colB`, `order=asc,desc`\n- **Single record**: `only=latest` or `only=oldest` (optional `by=column`, defaults `id`)",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          },
                          "email": {
                            "type": "string"
                          },
                          "password_hash": {
                            "type": "string"
                          },
                          "plan": {
                            "type": "string",
                            "enum": [
                              "free",
                              "paid"
                            ],
                            "description": "dropdown: choose one of [free, paid]"
                          },
                          "payment_proof": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/read/users/{id}?Instance=41300_indie_comments_v2": {
      "get": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Retrieve a record by ID from users",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to retrieve"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved the record",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string"
                        },
                        "email": {
                          "type": "string"
                        },
                        "password_hash": {
                          "type": "string"
                        },
                        "plan": {
                          "type": "string",
                          "enum": [
                            "free",
                            "paid"
                          ],
                          "description": "dropdown: choose one of [free, paid]"
                        },
                        "payment_proof": {
                          "type": "string"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/search/users?Instance=41300_indie_comments_v2": {
      "post": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Search for records in users",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "password_hash": {
                    "type": "string"
                  },
                  "plan": {
                    "type": "string",
                    "enum": [
                      "free",
                      "paid"
                    ],
                    "description": "dropdown: choose one of [free, paid]"
                  },
                  "payment_proof": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved matching records",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          },
                          "email": {
                            "type": "string"
                          },
                          "password_hash": {
                            "type": "string"
                          },
                          "plan": {
                            "type": "string",
                            "enum": [
                              "free",
                              "paid"
                            ],
                            "description": "dropdown: choose one of [free, paid]"
                          },
                          "payment_proof": {
                            "type": "string"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/update/users/{id}?Instance=41300_indie_comments_v2": {
      "put": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Update a record in users",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "password_hash": {
                    "type": "string"
                  },
                  "plan": {
                    "type": "string",
                    "enum": [
                      "free",
                      "paid"
                    ],
                    "description": "dropdown: choose one of [free, paid]"
                  },
                  "payment_proof": {
                    "type": "string"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully updated the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    },
    "/delete/users/{id}?Instance=41300_indie_comments_v2": {
      "delete": {
        "tags": [
          "Endpoints"
        ],
        "summary": "Delete a record from users",
        "parameters": [
          {
            "$ref": "#/components/parameters/Instance"
          },
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the record to delete"
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully deleted the record"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Record Not Found"
          },
          "500": {
            "description": "Server error"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "parameters": {
      "Instance": {
        "name": "Instance",
        "in": "query",
        "required": true,
        "schema": {
          "type": "string",
          "default": "41300_indie_comments_v2"
        },
        "description": "Instance Name"
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "tags": [
    {
      "name": "Endpoints",
      "description": "Operations related to the API endpoints"
    },
    {
      "name": "Join Endpoints",
      "description": "Operations related to table joins"
    }
  ]
}
