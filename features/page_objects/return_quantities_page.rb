class ReturnQuantitiesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:heading_mini, ".heading-medium")
  elements(:quantity_fields, ".form-control--small")
  elements(:reading_fields, ".form-control--reading")
  element(:submit_button, "button")

  def populate_volumes
    # Populate random volumes and blanks throughout the return period, regardless of frequency.
    total = 0
    quantity_fields.each do |quantity|
      # Alternate between blanks and random numbers that total up to 7,000,000,000 (the size of Loch Ness in m3)
      if rand(0..2).zero?
        # Make 1 in 3 entries blank
        quantity.set("")
      else
        # Enter a random quantity up to 7,000,000,000 m3 / 52, with 3 decimal places
        abs_quantity = rand(0..134_615_385_000) / 1000
        quantity.set(abs_quantity.to_s)
        total += abs_quantity
      end
    end
    total
  end

  def populate_meter_readings
    # Populate random volumes and blanks throughout the return period, regardless of frequency.
    # This function assumes that the initial meter reading is 0.
    total = 0
    reading_fields.each do |quantity|
      # Alternate between blanks and random numbers that total up to 7,000,000,000 (the size of Loch Ness in m3)
      if rand(0..2).zero?
        # Make 1 in 3 entries blank
        quantity.set("")
      else
        # Enter a random quantity up to 7,000,000,000 m3 / 52, with 3 decimal places
        abs_quantity = rand(0..134_615_385_000) / 1000
        total += abs_quantity
        # As it's a meter reading, the entered value must not decrease, so enter the total so far.
        quantity.set(total.to_s)
      end
    end
    total
  end

end
