const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;

const intitalizationofdbandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("Server is Running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB error is ${error.message}`);
    process.exit(1);
  }
};

intitalizationofdbandserver();

//GET API

app.get("/todos/", async (request, response) => {
  let { status = "", priority = "", search_q = "" } = request.query;
  let query = `
    select * from todo where status like '%${status}%' and
    priority like '%${priority}%' and
    todo like '%${search_q}%'`;
  let res = await db.all(query);
  response.send(res);
});

//GET /todos/:todoId/

app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let query = `
    select * from todo where id=${todoId}`;
  let res = await db.get(query);
  response.send(res);
});

// POST

app.post("/todos/", async (request, response) => {
  let { id, todo, priority, status } = request.body;
  let query = `
  insert into todo(id,todo,priority,status) values(${id},'${todo}','${priority}','${status}');`;
  await db.run(query);
  response.send("Todo Successfully Added");
});

// PUT

app.put("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let { status = "", priority = "", todo = "" } = request.body;
  console.log(status);
  if (status !== "") {
    let query = `
        update todo set status='${status}' where id=${todoId};`;
    await db.run(query);
    response.send("Status Updated");
  } else if (priority !== "") {
    let query = `
        update todo set priority='${priority}' where id=${todoId};`;
    await db.run(query);
    response.send("Priority Updated");
  } else if (todo !== "") {
    let query = `
        update todo set todo='${todo}' where id=${todoId};`;
    await db.run(query);
    response.send("Todo Updated");
  }
});

// DELETE

app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let query = `
    delete from todo where id=${todoId};`;
  await db.run(query);
  response.send("Todo Deleted");
});

module.exports = app;
