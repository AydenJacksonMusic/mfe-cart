import { expect, test } from "../fixtures/tokenizedPage"

test.describe("Quantity not available", () => {
  test.use({
    options: {
      orderType: "with-items",
      lineItemsAttributes: [
        {
          sku_code: "TSHIRTMM000000FFFFFFXLXX",
          quantity: 2,
        },
      ],
    },
  })

  test("should see an error when selecting non available quantity", async ({
    CartPage,
  }) => {
    await CartPage.checkItemQuantity(2)
    await CartPage.quantitySelectorInput.fill("10")
    await CartPage.checkItemQuantity(2)
    await expect(
      CartPage.page.locator("text=The selected quantity is not available")
    ).toBeVisible()
  })
})

test.describe("Not available error message should appear only for single line item", () => {
  test.use({
    options: {
      orderType: "with-items",
      lineItemsAttributes: [
        {
          sku_code: "SHIRT34SFFFFFF000000SXXX",
          quantity: 1,
        },
        {
          sku_code: "BEACHAIRFFFFFF000000XXXX",
          quantity: 1,
        },
      ],
    },
  })

  test("should see an error when selecting non available quantity", async ({
    CartPage,
  }) => {
    const itemShirt = CartPage.page.locator("[data-test-id=line-item-skus]", {
      hasText: "Shirt",
    })
    const itemBeanChair = CartPage.page.locator(
      "[data-test-id=line-item-skus]",
      {
        hasText: "Bean Chair",
      }
    )
    await itemShirt.locator("[data-test-id=input-spinner-element]").fill("800")

    await expect(
      itemShirt.locator("text=The selected quantity is not available")
    ).toBeVisible()

    await expect(
      itemBeanChair.locator("text=The selected quantity is not available")
    ).not.toBeVisible()
  })
})
