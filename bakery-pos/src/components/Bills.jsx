import { useState, useEffect } from 'react';
import { billsAPI } from '../services/api';

function Bills() {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedBill, setSelectedBill] = useState(null);

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        filterBills();
    }, [searchTerm, dateFilter, bills]);

    const fetchBills = async () => {
        try {
            const response = await billsAPI.getAll();
            setBills(response.data);
            setFilteredBills(response.data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBills = () => {
        let filtered = [...bills];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(bill =>
                bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            if (dateFilter === 'today') {
                filterDate.setHours(0, 0, 0, 0);
            } else if (dateFilter === 'week') {
                filterDate.setDate(now.getDate() - 7);
            } else if (dateFilter === 'month') {
                filterDate.setMonth(now.getMonth() - 1);
            }

            filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
        }

        setFilteredBills(filtered);
    };

    const handlePrint = (bill) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${bill.billNumber}</title>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #1a1a1e;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #d42f46;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              color: #d42f46;
              font-size: 32px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .bill-info {
              display: flex;
              justify-between;
              margin-bottom: 30px;
            }
            .bill-info div {
              flex: 1;
            }
            .bill-info h3 {
              margin: 0 0 10px 0;
              color: #1a1a1e;
              font-size: 14px;
              text-transform: uppercase;
            }
            .bill-info p {
              margin: 5px 0;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            thead {
              background-color: #f7f7f8;
            }
            th {
              text-align: left;
              padding: 12px;
              font-weight: 600;
              border-bottom: 2px solid #d9d9de;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eeeef0;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .totals div {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }
            .totals .total {
              font-size: 20px;
              font-weight: bold;
              border-top: 2px solid #d9d9de;
              padding-top: 12px;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #d9d9de;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍰 Bakery POS</h1>
            <p>Professional Bakery Management System</p>
          </div>

          <div class="bill-info">
            <div>
              <h3>Bill To:</h3>
              <p><strong>${bill.customerName}</strong></p>
              <p>Payment Method: ${bill.paymentMethod.toUpperCase()}</p>
            </div>
            <div style="text-align: right;">
              <h3>Invoice Details:</h3>
              <p><strong>Bill #:</strong> ${bill.billNumber}</p>
              <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${item.price.toFixed(2)}</td>
                  <td class="text-right">₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div>
              <span>Subtotal:</span>
              <span>₹${bill.subtotal.toFixed(2)}</span>
            </div>
            ${bill.packingCharges > 0 ? `
            <div>
              <span>Packing Charges:</span>
              <span>₹${bill.packingCharges.toFixed(2)}</span>
            </div>
            ` : ''}
            <div>
              <span>Tax:</span>
              <span>₹${bill.tax.toFixed(2)}</span>
            </div>
            <div class="total">
              <span>Total:</span>
              <span>₹${bill.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="win-window p-4 text-center text-sm">
                    <div className="mb-2">Please wait...</div>
                    <div className="win-panel-sunken p-1 text-xs">Loading bills</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-1">Bills & Invoices</h1>
                    <p className="text-gray-600">View and manage all generated bills</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total Bills</p>
                    <p className="text-2xl font-bold text-dark-900">{bills.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Search Bills</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by bill number or customer name..."
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="label">Filter by Date</label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bills List */}
            {filteredBills.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="win-panel-sunken w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-bold mb-1">No Bills Found</h3>
                    <p className="text-xs">
                        {searchTerm || dateFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Bills will appear here when orders are created'}
                    </p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Bill Number</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Payment</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map(bill => (
                                    <tr key={bill._id}>
                                        <td className="font-semibold text-dark-900">{bill.billNumber}</td>
                                        <td>{bill.customerName}</td>
                                        <td className="text-sm text-gray-600">{formatDate(bill.createdAt)}</td>
                                        <td className="text-sm">{bill.items.length} item(s)</td>
                                        <td>
                                            <span className="badge badge-info">
                                                {bill.paymentMethod.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="font-bold text-dark-900">{formatCurrency(bill.total)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedBill(bill)}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handlePrint(bill)}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    Print
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bill Details Modal */}
            {selectedBill && (
                <div className="modal-overlay" onClick={() => setSelectedBill(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="text-xl font-bold text-dark-900">{selectedBill.billNumber}</h2>
                                <p className="text-sm text-gray-600">{formatDate(selectedBill.createdAt)}</p>
                            </div>
                            <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold text-dark-900">{selectedBill.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <span className="badge badge-info">{selectedBill.paymentMethod.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold text-dark-900 mb-2">Items</p>
                                    <div className="space-y-2">
                                        {selectedBill.items.map((item, idx) => (
                                            <div key={idx} className="win-panel-raised flex justify-between p-2 text-xs">
                                                <div>
                                                    <p className="font-bold">{item.name}</p>
                                                    <p>{item.quantity} × {formatCurrency(item.price)}</p>
                                                </div>
                                                <p className="font-bold">{formatCurrency(item.total)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="win-panel-sunken p-2 mt-2">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span className="font-bold">{formatCurrency(selectedBill.subtotal)}</span>
                                        </div>
                                        {selectedBill.packingCharges > 0 && (
                                            <div className="flex justify-between">
                                                <span>Packing Charges:</span>
                                                <span className="font-bold">{formatCurrency(selectedBill.packingCharges)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Tax:</span>
                                            <span className="font-bold">{formatCurrency(selectedBill.tax)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t border-[#808080] pt-1">
                                            <span>TOTAL:</span>
                                            <span>{formatCurrency(selectedBill.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setSelectedBill(null)} className="btn btn-secondary">
                                Close
                            </button>
                            <button onClick={() => handlePrint(selectedBill)} className="btn btn-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bills;
