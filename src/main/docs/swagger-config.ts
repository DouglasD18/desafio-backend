export default {
  "openapi": "3.0.1",
  "info": {
    "title": "API de Usuários e Tarefas",
    "description": "Documentação da API para gerenciamento de usuários e tarefas.",
    "contact": {
      "url": "https://github.com/DouglasD18/desafio-backend",
      "email": "daguiaralcantara@gmail.com"
    },
    "version": "1.0.0"
  },
  "paths": {
    "/user": {
      "post": {
        "summary": "Criar um novo usuário",
        "description": "Endpoint para criar um novo usuário no sistema.",
        "tags": ["Usuários"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UsuarioPost" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Usuário criado com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string", "example": "654321abcde" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição. Os dados enviados são inválidos.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Nome, email e senha são obrigatórios." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Listar todos os usuários",
        "description": "Obtém uma lista de todos os usuários cadastrados.",
        "tags": ["Usuários"],
        "responses": {
          "200": {
            "description": "Lista de usuários.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Usuario" }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      },
    },
    "/user/{id}": {
      "put": {
        "summary": "Atualizar usuário",
        "description": "Endpoint para atualizar as informações de um usuário.",
        "tags": ["Usuários"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID do usuário a ser atualizado."
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UsuarioUpdate"
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "Usuário atualizado com sucesso, sem conteúdo retornado."
          },
          "400": {
            "description": "Erro na requisição. Os dados informados são inválidos.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Dados inválidos." }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Usuário não encontrado.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Usuário não encontrado." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Deletar usuário",
        "description": "Endpoint para deletar um usuário.",
        "tags": ["Usuários"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID do usuário a ser atualizado."
          }
        ],
        "responses": {
          "204": {
            "description": "Usuário atualizado com sucesso, sem conteúdo retornado."
          },
          "400": {
            "description": "Erro na requisição. Os dados informados são inválidos.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Dados inválidos." }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Usuário não encontrado.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Usuário não encontrado." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/{id}/task": {
      "get": {
        "summary": "Listar tarefas por usuário",
        "description": "Endpoint para obter todas as tarefas associadas a um usuário específico.",
        "tags": ["Tarefas"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID do usuário cujas tarefas devem ser listadas."
          }
        ],
        "responses": {
          "200": {
            "description": "Lista de tarefas obtida com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Tarefa"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição. O ID do usuário é inválido.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "ID do usuário é obrigatório." }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Usuário não encontrado.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Usuário não encontrado." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/task": {
      "post": {
        "summary": "Criar uma nova tarefa",
        "description": "Cria uma nova tarefa associada a um usuário.",
        "tags": ["Tarefas"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/TarefaRequest" }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tarefa criada com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição. Os dados enviados são inválidos.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": {
                      "type": "string",
                      "example": "Dados inválidos."
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Usuário não encontrado.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": {
                      "type": "string",
                      "example": "Usuário não encontrado."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": {
                      "type": "string",
                      "example": "Erro desconhecido no servidor."
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Listar todas as tarefas",
        "description": "Obtém uma lista de todas as tarefas cadastradas.",
        "tags": ["Tarefas"],
        "responses": {
          "200": {
            "description": "Lista de tarefas obtida com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Tarefa" }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": {
                      "type": "string",
                      "example": "Erro desconhecido"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/task/{id}": {
      "patch": {
        "summary": "Atualizar status de tarefa",
        "description": "Endpoint para atualizar o status de uma tarefa específica.",
        "tags": ["Tarefas"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID da tarefa a ser atualizada."
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "enum": ["pendente", "em progresso", "concluída"]
                  }
                },
                "required": ["status"]
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "Status da tarefa atualizado com sucesso, sem conteúdo retornado."
          },
          "400": {
            "description": "Erro na requisição. Os dados enviados são inválidos.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Status inválido." }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Tarefa não encontrada.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Tarefa não encontrada." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Excluir uma tarefa",
        "description": "Endpoint para excluir uma tarefa específica com base no ID.",
        "tags": ["Tarefas"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID da tarefa a ser excluída."
          }
        ],
        "responses": {
          "204": {
            "description": "Tarefa excluída com sucesso, sem conteúdo retornado."
          },
          "400": {
            "description": "Erro na requisição. O ID da tarefa fornecido é inválido.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "ID inválido." }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Tarefa não encontrada.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Tarefa não encontrada." }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno no servidor.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "erro": { "type": "string", "example": "Erro desconhecido no servidor." }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Usuario": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "nome": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "senha": { "type": "string" }
        }
      },
      "UsuarioPost": {
        "type": "object",
        "properties": {
          "nome": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "senha": { "type": "string" }
        }
      },
      "UsuarioUpdate": {
        "type": "object",
        "properties": {
          "nome": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "senha": {
            "type": "string",
          }
        }
      },
      "Tarefa": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "usuarioId": { "type": "string" },
          "titulo": { "type": "string" },
          "descricao": { "type": "string" },
          "status": { "type": "string", "enum": ["pendente", "em progresso", "concluída"] }
        }
      },
      "TarefaPost": {
        "type": "object",
        "properties": {
          "usuarioId": { "type": "string" },
          "titulo": { "type": "string" },
          "descricao": { "type": "string" },
          "status": { "type": "string", "enum": ["pendente", "em progresso", "concluída"] }
        }
      }
    }
  }
}
