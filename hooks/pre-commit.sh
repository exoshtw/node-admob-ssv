#!/bin/bash

show_error() {
    local CODE=${2:-1}
    echo -e "\033[41mCOMMIT FAILED:\033[0m $1" > /dev/stderr
    exit $CODE
}

show_ok() {
    echo -e "\033[32m$1\033[0m"
}

show_nook() {
    echo -e "\033[31m$1\033[0m"
}

## Prevent master commits!

CURRENT_BRANCH=$(git symbolic-ref HEAD)
STAGED_CODE_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$" | grep "src/" )
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
TEST_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".test.jsx\{0,1\}$" )

MASTER_BRANCH_NAME=$(git config gitflow.branch.master)
MASTER_BRANCH_NAME=${MASTER_BRANCH_NAME:-master};

if [ "$CURRENT_BRANCH" == "refs/heads/${MASTER_BRANCH_NAME}" ]; then
    show_error "Direct commits to the master branch are not allowed." 1
fi

## Prevent marker commits

MERGE_FILES=""

for FILE in $STAGED_FILES; do
    if egrep -rls "^<<<<<<< |^>>>>>>> $" "$FILE" > /dev/null; then
        DETAIL=$(grep -Pzo "(?s)<<<<<<<.*>>>>>>>" $FILE | tr '\0' '\n')
        MERGE_FILES="$MERGE_FILES\n$FILE:\n"
        MERGE_FILES="$MERGE_FILES\n\e[90m$DETAIL\e[0m"
        MERGE_FILES="$MERGE_FILES\n\n"
    fi
done

if [ -n "$MERGE_FILES" ]; then
    echo -e "$MERGE_FILES"
    show_error "Merge markers found" 2
fi

## Prevent .only tests

ONLY_FILES=""

for FILE in $TEST_FILES; do
    if egrep -rls "\.only" "$FILE" > /dev/null; then
        DETAIL=$(GREP_COLOR='101;1;5;200' grep --color=always -nC4 ".only" $FILE)
        ONLY_FILES="$ONLY_FILES\n$FILE\n"
        ONLY_FILES="$ONLY_FILES\n\e[90m"
        ONLY_FILES="$ONLY_FILES\n$DETAIL"
        ONLY_FILES="$ONLY_FILES\n\e[0m"
    fi
done

if [ -n "$ONLY_FILES" ]; then
    echo -e "$ONLY_FILES"
    show_error "Only flags found in tests" 3
fi

## Prevent no-linted files

if [ -x "npx" ]; then
    ESLINT="npx eslint"
else
    ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"
fi

if [ -n "$STAGED_CODE_FILES" ]; then
    PASS=1

    echo "Validating Javascript:"

    # Check for eslint
    if [ ! -x "$ESLINT" ]; then
      show_error "Please install ESlint" 99
    fi

    for FILE in $STAGED_CODE_FILES; do
      $ESLINT "$FILE"

      if [ $? -eq 0 ]; then
        # echo "\t\033[32mESLint Passed: $FILE\033[0m"
        show_ok "\t✓ $FILE"
      else
        #echo "\t\033[41mESLint Failed: $FILE\033[0m"
        show_nook "\t✗ $FILE"
        PASS=0
      fi
    done

    if [ $PASS -eq 0 ]; then
        echo
      show_error "Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n" 3
    else
      #echo "\t\033[42mLint success, continue commiting...\033[0m\n"
      show_ok "Lint success!"
    fi
fi

exit 0
