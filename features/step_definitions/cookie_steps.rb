Then("the cookie banner is shown") do
  expect(@front_app.licences_page).to have_cookie_banner
end

Then("the cookie banner is not shown") do
  expect(@front_app.licences_page).not_to have_cookie_banner
end
