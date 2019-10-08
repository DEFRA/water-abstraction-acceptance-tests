Then("the cookie banner is shown") do
  expect(@last_page).to have_cookie_banner
end

Then("the cookie banner is not shown") do
  expect(@last_page).not_to have_cookie_banner
end
