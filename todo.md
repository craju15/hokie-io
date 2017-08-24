# Ask A Hokie Todo List

## UI/Front End Elements to Add:

[X] Search Bar
[X] Drop down menu
[X]- Search Results Page
[X] keep track of current user
[X] About Page

## Backend + DB Functionality to Add:

[X] upvote/downvote system
[X] answers
[X] rich text for answers
[X] Allow only 1 answer per questions per user
[X] new question with rich text
[X] comments
[X] new comment
[X] Allow only 1 comment per answer per user
[X] new account

[_] account settings
[_] point/rank system (total upvotes or something)


[X] SEARCH FUNCTIONALITY
[X] QUICK SEARCH FUNCTIONALITY

~~[_] remove default data (might be difficult)~~


[X] *make logged-in buttons send to login/signup when not logged in

[X] *clear database
[_] add some starter questions

[X] *handle all errors

[X] *change website name

[X] change signup to use virginia tech people API

[_] STAT COUNTERS
[_] > create a view counter per page
[_] > create activity document (bottom)

[_] start writing tests

[_] restrict number of questions returned for "recent questions"

## Features for Later:

[_] allow users to change profile picture

[_] make question accepted
[_] > for now, make the highest one green, and negative ones pink

[_] DELETIONS:
[_] > delete question
[_] > delete answer
[_] > delete comment

[_] EDITS:
[_] > edit question
[_] > edit answer
[_] > edit comment

[_] point/rank system (total upvotes or something) (leaderboard)
[_] mark as duplicate

[_] report question
[_] report answer

[_] make header responsive

## BUGS
[X] profile >> profile does not reload content
  > fix in header?
[X] question >> question page does not reload content (either)
  > same fix

CAPTCHA SETTINGS:
https://www.google.com/recaptcha/admin#site/338367793?setup

ACTIVITY DOCUMENT:
activity: {
  page: "[page name]",
  date: Date(),
  userID: "[userID]"
}
