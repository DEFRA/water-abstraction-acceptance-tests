class ReturnSubmittedPage < SitePrism::Page
  element(:confirmation_box, ".panel.panel--confirmation")
  element(:view_return_link, "a", text: "View this return")
end
