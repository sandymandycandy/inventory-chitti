import { useState, useEffect } from 'react';
import { ordersAPI, recipesAPI, customersAPI } from '../services/api';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [cart, setCart] = useState([]);
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [allCustomers, setAllCustomers] = useState([]);
    const [customerSearchTerm, setCustomerSearchTerm] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);
    const [packingCharges, setPackingCharges] = useState(0);

    // New customer form
    const [newCustomerData, setNewCustomerData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, recipesRes, customersRes] = await Promise.all([
                ordersAPI.getAll(),
                recipesAPI.getAll(),
                customersAPI.getAll()
            ]);
            setOrders(ordersRes.data);
            setRecipes(recipesRes.data);
            setAllCustomers(customersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (recipe) => {
        const existing = cart.find(item => item.recipe._id === recipe._id);
        if (existing) {
            setCart(cart.map(item =>
                item.recipe._id === recipe._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { recipe, quantity: 1 }]);
        }
    };

    const updateQuantity = (recipeId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(cart.filter(item => item.recipe._id !== recipeId));
        } else {
            setCart(cart.map(item =>
                item.recipe._id === recipeId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const removeFromCart = (recipeId) => {
        setCart(cart.filter(item => item.recipe._id !== recipeId));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.recipe.sellingPrice * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
        return 0; // Tax-free system
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const packing = parseFloat(packingCharges) || 0;
        // No tax - total equals subtotal + packing charges
        return subtotal + packing;
    };

    const handleCustomerLookup = async () => {
        if (!customerPhone || customerPhone.length < 10) {
            return;
        }

        setCustomerLoading(true);
        try {
            const response = await customersAPI.getByPhone(customerPhone);
            setSelectedCustomer(response.data);
            setCustomerName(response.data.name);
        } catch (error) {
            // Customer not found - that's okay
            setSelectedCustomer(null);
        } finally {
            setCustomerLoading(false);
        }
    };

    const handleCreateCustomer = async () => {
        if (!newCustomerData.name || !newCustomerData.phone) {
            alert('Please enter name and phone number');
            return;
        }

        if (newCustomerData.phone.length < 10) {
            alert('Phone number must be 10 digits');
            return;
        }

        try {
            const response = await customersAPI.create(newCustomerData);
            setSelectedCustomer(response.data);
            setCustomerName(response.data.name);
            setCustomerPhone(response.data.phone);
            setShowNewCustomerModal(false);
            setNewCustomerData({ name: '', phone: '', email: '' });
            alert(`Customer ${response.data.name} created successfully!`);
        } catch (error) {
            alert(error.response?.data?.error || 'Error creating customer');
        }
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            alert('Please add items to cart');
            return;
        }

        setProcessing(true);
        try {
            const orderData = {
                customerId: selectedCustomer?._id,
                customerPhone: customerPhone || null,
                customerName: customerName || 'Walk-in Customer',
                items: cart.map(item => ({
                    recipeId: item.recipe._id,
                    quantity: item.quantity
                })),
                packingCharges: parseFloat(packingCharges) || 0,
                paymentMethod
            };

            const response = await ordersAPI.create(orderData);

            // Success message
            let successMsg = `Order Created Successfully!\nOrder Number: ${response.data.order.orderNumber}\nBill Number: ${response.data.bill.billNumber}\nTotal: ₹${response.data.order.total.toFixed(2)}`;

            if (selectedCustomer) {
                successMsg += `\n\nCustomer: ${selectedCustomer.name}`;
            }

            alert(successMsg);

            // Reset form
            setCart([]);
            setCustomerName('');
            setCustomerPhone('');
            setSelectedCustomer(null);
            setPackingCharges(0);
            setPaymentMethod('cash');
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('Error creating order:', error);
            alert(error.response?.data?.error || 'Error creating order. Please check stock availability.');
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading orders</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Order Management</h1>
                    <p className="text-gray-600">Create and track customer orders</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Order
                </button>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="win-panel-sunken w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-bold mb-1">No Orders Yet</h3>
                    <p className="text-xs mb-4">Create your first order to get started</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Create First Order
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="card p-6 card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-dark-900">{order.orderNumber}</h3>
                                        <span className="badge badge-success">Completed</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {order.customerName} • {formatDate(order.createdAt)} • {order.paymentMethod.toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(order.total)}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm font-semibold text-dark-700 mb-2">Items:</p>
                                <div className="space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.quantity}x {item.recipeName}
                                            </span>
                                            <span className="font-medium text-dark-900">
                                                {formatCurrency(item.subtotal)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Order Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !processing && setShowModal(false)}>
                    <div className="modal-content max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl md:text-2xl font-bold text-dark-900">Create New Order</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={processing}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Products */}
                                <div className="order-1 md:order-1">
                                    <h3 className="font-semibold text-dark-900 mb-3">Select Products</h3>
                                    <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto pr-2">
                                        {recipes.map(recipe => (
                                            <div
                                                key={recipe._id}
                                                className="win-panel-raised p-2 cursor-pointer flex gap-2 hover:bg-[#000080] hover:text-white"
                                                onClick={() => addToCart(recipe)}
                                            >
                                                {/* Recipe Image */}
                                                <div className="w-12 h-12 flex-shrink-0 win-panel-sunken overflow-hidden">
                                                    {recipe.imageUrl ? (
                                                        <img
                                                            src={recipe.imageUrl}
                                                            alt={recipe.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#d4d0c8]">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start flex-1">
                                                    <div>
                                                        <p className="font-semibold text-dark-900">{recipe.name}</p>
                                                        <p className="text-xs text-gray-600">{recipe.category}</p>
                                                    </div>
                                                    <p className="font-bold text-primary-600">{formatCurrency(recipe.sellingPrice)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Cart */}
                                <div className="order-2 md:order-2">
                                    <h3 className="font-semibold text-dark-900 mb-3">Order Cart</h3>

                                    <div className="space-y-3 mb-4">
                                        {/* Customer Phone Lookup */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="label">Customer Search</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewCustomerModal(true)}
                                                    className="btn btn-sm bg-green-100 text-green-700 hover:bg-green-200"
                                                >
                                                    + New Customer
                                                </button>
                                            </div>

                                            {/* Search by Name */}
                                            <div className="relative mb-3">
                                                <input
                                                    type="text"
                                                    value={customerSearchTerm}
                                                    onChange={(e) => {
                                                        setCustomerSearchTerm(e.target.value);
                                                        setShowCustomerDropdown(true);
                                                    }}
                                                    onFocus={() => setShowCustomerDropdown(true)}
                                                    className="input w-full"
                                                    placeholder="Search customer by name..."
                                                />
                                                {showCustomerDropdown && customerSearchTerm && (
                                                    <div className="absolute z-10 w-full mt-0 win-window max-h-48 overflow-y-auto">
                                                        {allCustomers
                                                            .filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()))
                                                            .map(customer => (
                                                                <div
                                                                    key={customer._id}
                                                                    className="win-menu-item flex justify-between items-center border-b border-[#c0c0c0] cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(customer);
                                                                        setCustomerName(customer.name);
                                                                        setCustomerPhone(customer.phone);
                                                                        setCustomerSearchTerm('');
                                                                        setShowCustomerDropdown(false);
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <p className="font-bold text-xs">{customer.name}</p>
                                                                        <p className="text-xs">{customer.phone}</p>
                                                                    </div>
                                                                    <span className="badge">Select</span>
                                                                </div>
                                                            ))
                                                        }
                                                        {allCustomers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase())).length === 0 && (
                                                            <div className="win-menu-item text-xs">No customers found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    value={customerPhone}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setCustomerPhone(val);
                                                        if (val.length >= 10) {
                                                            handleCustomerLookup();
                                                        } else {
                                                            setSelectedCustomer(null);
                                                        }
                                                    }}
                                                    className="input flex-1"
                                                    placeholder="Or enter phone number"
                                                    maxLength={10}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleCustomerLookup}
                                                    disabled={!customerPhone || customerPhone.length < 10 || customerLoading}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    {customerLoading ? '...' : '🔍'}
                                                </button>
                                            </div>
                                            {selectedCustomer && (
                                                <div className="mt-2 win-panel-sunken p-2 text-xs flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold">✓ {selectedCustomer.name}</p>
                                                        <p className="text-xs">{selectedCustomer.phone}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(null);
                                                            setCustomerName('');
                                                            setCustomerPhone('');
                                                        }}
                                                        className="btn btn-sm"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Customer Name */}
                                        <div>
                                            <label className="label">Customer Name</label>
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="input"
                                                placeholder="Walk-in Customer"
                                                disabled={selectedCustomer !== null}
                                            />
                                        </div>

                                        <div>
                                            <label className="label">Payment Method</label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="input"
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="upi">UPI</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {cart.length === 0 ? (
                                        <div className="win-panel-sunken p-6 text-center text-xs">
                                            <p>Cart is empty</p>
                                            <p>Click on products to add</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {cart.map(item => (
                                                <div key={item.recipe._id} className="win-panel-raised flex items-center gap-2 p-1">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-xs">{item.recipe.name}</p>
                                                        <p className="text-xs">{formatCurrency(item.recipe.sellingPrice)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.recipe._id, item.quantity - 1)}
                                                            className="btn btn-sm w-6 h-6 p-0 flex items-center justify-center"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.recipe._id, item.quantity + 1)}
                                                            className="btn btn-sm w-6 h-6 p-0 flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.recipe._id)}
                                                            className="btn btn-sm ml-1"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Order Summary */}
                                            <div className="win-panel-sunken p-2 mt-2 space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span className="font-bold">{formatCurrency(calculateSubtotal())}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <label>Packing:</label>
                                                    <div className="flex items-center gap-1">
                                                        <span>₹</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={packingCharges}
                                                            onChange={(e) => setPackingCharges(e.target.value)}
                                                            className="input w-20 text-right"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax:</span>
                                                    <span className="font-bold">₹0.00 (Tax-Free)</span>
                                                </div>
                                                <div className="flex justify-between font-bold border-t border-[#808080] pt-1">
                                                    <span>TOTAL:</span>
                                                    <span>{formatCurrency(calculateTotal())}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={processing}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitOrder}
                                disabled={processing || cart.length === 0}
                                className="btn btn-primary"
                            >
                                {processing ? 'Processing...' : `Create Order - ${formatCurrency(calculateTotal())}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Customer Modal */}
            {showNewCustomerModal && (
                <div className="modal-overlay" onClick={() => setShowNewCustomerModal(false)}>
                    <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="text-xl font-bold text-dark-900">Create New Customer</h2>
                            <button
                                onClick={() => setShowNewCustomerModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Name*</label>
                                    <input
                                        type="text"
                                        value={newCustomerData.name}
                                        onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                                        className="input"
                                        placeholder="Customer name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Phone*</label>
                                    <input
                                        type="tel"
                                        value={newCustomerData.phone}
                                        onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                                        className="input"
                                        placeholder="10-digit phone number"
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={newCustomerData.email}
                                        onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                                        className="input"
                                        placeholder="customer@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => setShowNewCustomerModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCustomer}
                                className="btn btn-primary"
                            >
                                Create Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
