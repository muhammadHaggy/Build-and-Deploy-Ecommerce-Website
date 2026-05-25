document.addEventListener("DOMContentLoaded", function() {
    
    // Ensure dataLayer is initialized
    window.dataLayer = window.dataLayer || [];

    // 1. Add to Cart on Shop Page
    const shopCartBtns = document.querySelectorAll('#product1 .pro .cart-btn');
    shopCartBtns.forEach(btn => {
        // Remove the inline onclick attribute so it doesn't interfere
        btn.removeAttribute('onclick'); 
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const proDiv = this.closest('.pro');
            const title = proDiv.querySelector('.des h5').innerText;
            const priceText = proDiv.querySelector('.des h4').innerText;
            const price = parseFloat(priceText.replace('$', ''));

            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    currency: "USD",
                    value: price,
                    items: [
                        {
                            item_name: title,
                            price: price,
                            quantity: 1
                        }
                    ]
                }
            });
            console.log("GA4 add_to_cart fired:", title, price);
            alert('Item added to cart! (GA4 add_to_cart fired for ' + title + ')');
        });
    });

    // 2. Add to Cart on Single Product Page
    const singleAddToCartBtn = document.getElementById('add-to-cart-btn');
    if (singleAddToCartBtn) {
        singleAddToCartBtn.removeAttribute('onclick');
        singleAddToCartBtn.addEventListener('click', function() {
            const title = document.querySelector('.single-pro-details h4').innerText;
            const priceText = document.querySelector('.single-pro-details h2').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            const qtyElement = document.getElementById('product-qty');
            const qty = qtyElement ? (parseInt(qtyElement.value) || 1) : 1;
            const sizeElement = document.getElementById('product-size');
            const size = sizeElement ? sizeElement.value : '';

            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    currency: "USD",
                    value: price * qty,
                    items: [
                        {
                            item_name: title,
                            price: price,
                            quantity: qty,
                            item_variant: size
                        }
                    ]
                }
            });
            console.log("GA4 add_to_cart fired (single product):", title, price, qty);
            alert('Item added to cart! (GA4 add_to_cart fired for ' + title + ')');
        });
    }

    // 3. Begin Checkout on Cart Page
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Build items array from table
            const items = [];
            const rows = document.querySelectorAll('#cart tbody tr');
            let totalValue = 0;

            rows.forEach(row => {
                const title = row.querySelector('td:nth-child(3)').innerText;
                const priceText = row.querySelector('td:nth-child(4)').innerText;
                const price = parseFloat(priceText.replace('$', ''));
                const qtyInput = row.querySelector('td:nth-child(5) input');
                const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

                items.push({
                    item_name: title,
                    price: price,
                    quantity: qty
                });
                totalValue += (price * qty);
            });

            window.dataLayer.push({
                event: "begin_checkout",
                ecommerce: {
                    currency: "USD",
                    value: totalValue,
                    items: items
                }
            });
            console.log("GA4 begin_checkout fired with value:", totalValue, items);
            alert('Proceeding to checkout! (GA4 begin_checkout fired)');
        });
    }
});
