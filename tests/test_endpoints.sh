BASE_URL="http://localhost:8080/index.php"
TOKEN="eyJ1c2VyX2lkIjoxfQ=="
AUTH="Authorization: Bearer $TOKEN"
CONTENT="Content-Type: application/json"

get_id() {
    echo $1 | grep -o '"id":[0-9]*' | grep -o '[0-9]*'
}

echo "POST TRANSACTION: "
TRANSACTION=$(curl -s -X POST "$BASE_URL/transactions" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{
        "category_id": 1,
        "entity_id":   1,
        "amount":  99,
        "transaction_date": "2026-06-03"
    }')
ID=$(get_id $TRANSACTION)
echo $TRANSACTION

echo "PUT TRANSACTION: "
echo $(curl -s -X PUT "$BASE_URL/transactions?id=$ID" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{
        "category_id": 2,
        "entity_id":   2,
        "amount":  100,
        "transaction_date": "2026-06-04"
    }')

echo "GET TRANSACTION: "
echo $(curl -s -X GET "$BASE_URL/transactions?id=$ID&category_id=2&max=100&min=100&start=2026-06-04&end=2026-06-04" \
    -H "$AUTH" \
    )

echo "DELETE TRANSACTION: "
echo $(curl -s -X DELETE "$BASE_URL/transactions?id=$ID" \
    -H "$AUTH")




echo "POST BUDGET: "
BUDGET=$(curl -s -X POST "$BASE_URL/budgets" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{
        "category_id": 1,
        "duration_id": 3,
        "amount":  99,
        "budget_start": "2026-06-03"
    }')
ID=$(get_id $BUDGET)
echo $BUDGET

echo "PUT BUDGET: "
echo $(curl -s -X PUT "$BASE_URL/budgets?id=$ID" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{
        "category_id": 2,
        "duration_id": 3,
        "budget_end":   "2026-07-03",
        "amount":  100
    }')

echo "GET BUDGET(s): "
echo $(curl -s -X GET "$BASE_URL/budgets?id=$ID&category_id=2" \
    -H "$AUTH" \
    )

echo "DELETE BUDGET: "
echo $(curl -s -X DELETE "$BASE_URL/budgets?id=$ID" \
    -H "$AUTH")





echo "POST ENTITY: "


NOW=$(date +%Y-%m-%d)
NAME="JP Morgan $NOW"


ENTITY=$(curl -s -X POST "$BASE_URL/entities" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"name": "JP MORGAN "}'
    )
ID=$(get_id $ENTITY)
echo $ENTITY

echo "GET ENTITY: "
echo $(curl -s -X GET "$BASE_URL/entities?id=$ID&name=JP" \
    -H "$AUTH" \
    )

echo "GET ENTITIE(s): "
echo $(curl -s -X GET "$BASE_URL/entities" \
    -H "$AUTH" \
    )




echo "POST USER: "
USERNAME="myusername_$(date +%s)"
USER=$(curl -s -X POST "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d "{\"name\": \"Test User\", \"username\": \"$USERNAME\", \"password\":\"mypassword\"}")
ID=$(get_id $USER)
echo $USER

echo "GET USER (self, from token): "
echo $(curl -s -X GET "$BASE_URL/users" \
    -H "$AUTH")

echo "PUT USER (self, rename): "
echo $(curl -s -X PUT "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"name": "Renamed User"}')

echo "POST USER (missing name -> should 400): "
echo $(curl -s -X POST "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{}')


echo "POST LOGIN (valid credentials): "
echo $(curl -s -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{
        "username": "username",
        "password": "password"
    }')

echo "POST LOGIN (wrong password -> should 401): "
echo $(curl -s -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{
        "username": "username",
        "password": "wrong"
    }')

echo "POST LOGIN (missing password -> should 400): "
echo $(curl -s -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{
        "username": "username"
    }')




echo "GET CATEGORIES(s): "
echo $(curl -s -X GET "$BASE_URL/categories" \
    -H "$AUTH" \
    )



sleep 100