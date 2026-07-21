tput rmam


BASE_URL="http://localhost:8080/index.php"
TOKEN=$(echo '{"user_id":1}' | base64)
AUTH="Authorization: Bearer $TOKEN"
CONTENT="Content-Type: application/json"

get_id() { echo $1 | grep -o '"id":[0-9]*' | grep -o '[0-9]*'; }

get_token() { echo $1 | grep -o '"token":"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"'; }

is_pass() { [[ "$1" == "$2" ]] && echo "PASS" || echo "FAIL"; }


test() {
    RESPONSE=$(curl -s -w "\n%{http_code}" "${@:3}")
    STATUS=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -1)
    printf "$(is_pass $STATUS $2): %-30s | %s\n" "$1" "$BODY"
}





test "Create Transaction" 200 \
    -X POST "$BASE_URL/transactions" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"category_id": 1, "entity_id": 1, "amount": 99, "transaction_date": "2026-06-03"}'

ID=$(get_id $BODY);

test "PUT Transaction" 200 \
    -X PUT "$BASE_URL/transactions?id=$ID" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"category_id": 2, "entity_id": 2, "amount": 100, "transaction_date": "2026-06-04"}'

test "GET Transaction" 200 \
    -X GET "$BASE_URL/transactions?id=$ID&category_id=2&max=100&min=100&start=2026-06-04&end=2026-06-04" \
    -H "$AUTH"

test "DELETE Transaction" 200 \
    -X DELETE "$BASE_URL/transactions?id=$ID" \
    -H "$AUTH"









test "POST Budget" 200 \
    -X POST "$BASE_URL/budgets" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"category_id": 1, "duration_id": 3, "amount": 99, "budget_start": "2026-06-03"}'

ID=$(get_id $BODY)

test "PUT Budget" 200 \
    -X PUT "$BASE_URL/budgets?id=$ID" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"category_id": 2, "duration_id": 3, "budget_end": "2026-07-03", "amount": 100}'

test "GET Budget" 200 \
    -X GET "$BASE_URL/budgets?id=$ID&category_id=2" \
    -H "$AUTH"

test "DELETE Budget" 200 \
    -X DELETE "$BASE_URL/budgets?id=$ID" \
    -H "$AUTH"




NAME="JP MORGAN $(date +%s)"

test "POST Entity" 200 \
    -X POST "$BASE_URL/entities" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d "{\"name\": \"$NAME\"}"

ID=$(get_id $BODY)

test "POST Entity Duplicate Name" 409 \
    -X POST "$BASE_URL/entities" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d "{\"name\": \"$NAME\"}"

test "GET Entity" 200 \
    -X GET "$BASE_URL/entities?id=$ID&name=JP" \
    -H "$AUTH"

test "GET Entities" 200 \
    -X GET "$BASE_URL/entities" \
    -H "$AUTH"

test "DELETE Entity" 200 \
    -X DELETE "$BASE_URL/entities?id=$ID" \
    -H "$AUTH"








test "GET User" 200 \
    -X GET "$BASE_URL/users" \
    -H "$AUTH"

test "PUT Rename User" 200 \
    -X PUT "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"name": "Renamed User"}'

test "POST User" 200 \
    -X POST "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"name": "Test User", "username": "automated", "password": "mypassword"}'

TOKEN2=$(get_token "$BODY")
AUTH2="Authorization: Bearer $TOKEN2"

test "PUT New User" 200 \
    -X PUT "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH2" \
    -d '{"name": "Test User Renamed"}'

ID=$(get_id $BODY)

test "POST Duplicate Username" 409 \
    -X POST "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{"name": "Test User", "username": "automated", "password": "mypassword"}'


test "POST With No Fields" 400 \
    -X POST "$BASE_URL/users" \
    -H "$CONTENT" \
    -H "$AUTH" \
    -d '{}'


test "DELETE User" 200 \
    -X DELETE "$BASE_URL/users?id=$ID" \
    -H "$AUTH2"





test "POST Login" 200 \
    -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{"username": "username", "password": "password"}'

test "POST Login Wrong Password" 401 \
    -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{"username": "username", "password": "wrong"}'

test "POST Login Missing Password" 400 \
    -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{"username": "username"}'

test "POST Login Non Existance" 401 \
    -X POST "$BASE_URL/login" \
    -H "$CONTENT" \
    -d '{"username": "nonexistant", "password": "password"}'




test "GET Categories" 200 \
    -X GET "$BASE_URL/categories" \
    -H "$AUTH"



sleep 100