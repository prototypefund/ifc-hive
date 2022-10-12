#!/bin/bash

## old runs
#time, build, e2e
#103207,8617,11280
#103235,8534,11480
#105140,8628,10135
#105216,8550,9557

getStamp() {
  date +%s%3N  
}

startServer() {
echo start server
#yarn vite preview --port 5050 &
#preview_pid=$!
## 20 sec limit
#for i in {1..200}; do 
#    resp=$(curl -o /dev/null -s -w "%{http_code}\n" http://localhost:5050);
#    echo probe server $resp $preview_pid
#    if [[ "$resp" == 200 ]]; then  break;  fi
#    sleep 0.1
#done
}

stopServer() {
    echo stop server doesn't WORK
    # preview_pid doesn't cover alle pids!!!
    kill -2 somepids 
}

# Produce runs 
# cd cypresstesting/cypress/e2e
# for i in {1..9}; do cp example1_00.cy.ts example1_$(printf "%02d" $i).cy.ts; done


start=$(date +%H%M%S)
# build
t0=$(getStamp)
yarn run build
t1=$(getStamp)

# run test
HEADER="run,info,build,tests"

tests="1"
info="cypress10_example3_01_novid"

MSG=$start,$info,$((t1-t0)),$tests
for browser in chrome firefox electron; do
    t2=$(getStamp)
    echo $browser
    yarn start-server-and-test preview http://localhost:4173/ "cypress run --e2e --browser $browser --reporter junit --reporter-options 'mochaFile=reports/my-test-output-[hash].xml,toConsole=true'"
    t3=$(getStamp)
    HEADER=$HEADER,$browser
    MSG=$MSG,$((t3-t2))
done

echo $HEADER
echo $MSG


[ ! -f cypress.run.csv ] && (echo $HEADER > cypress.run.csv)
[ "$(head -1 cypress.run.csv)" != "$HEADER" ] && (echo $HEADER > cypress.run.csv)

echo $MSG >> cypress.run.csv

