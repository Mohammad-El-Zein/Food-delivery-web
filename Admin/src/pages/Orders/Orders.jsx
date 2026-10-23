import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Wartet auf Zahlung' },
  { value: 'PREPARING', label: 'In Zubereitung' },
  { value: 'OUT_FOR_DELIVERY', label: 'Unterwegs' },
  { value: 'DELIVERED', label: 'Geliefert' },
  { value: 'CANCELLED', label: 'Storniert' },
];

const PAYMENT_BADGES = {
  PAID: { className: 'bg-success', label: 'Bezahlt' },
  FAILED: { className: 'bg-danger', label: 'Fehlgeschlagen' },
  PENDING: { className: 'bg-warning text-dark', label: 'Offen' },
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      setOrders(await getAllOrders());
    } catch {
      toast.error('Fehler beim Laden der Bestellungen.');
    } finally {
      setLoading(false);
    }
  }

  const changeStatus = async (orderId, orderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, orderStatus);
      setOrders(orders => orders.map(order => order.id === orderId ? updated : order));
      toast.success('Status aktualisiert.');
    } catch {
      toast.error('Fehler beim Ändern des Status.');
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <div className="d-flex justify-content-between align-items-center pt-3">
          <h4 className="mb-0">Bestellungen</h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={fetchOrders} title="Aktualisieren">
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mt-3">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Kunde</th>
                <th>Gerichte</th>
                <th>Betrag</th>
                <th>Zahlung</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && orders.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted">Noch keine Bestellungen.</td></tr>
              )}
              {orders.map((order) => {
                const payment = PAYMENT_BADGES[order.paymentStatus] || PAYMENT_BADGES.PENDING;
                return (
                  <tr key={order.id}>
                    <td className="text-nowrap">{formatDate(order.createdAt)}</td>
                    <td>
                      <div>{order.email}</div>
                      <small className="text-muted d-block">{order.phoneNumber}</small>
                      <small className="text-muted d-block">{order.userAddress}</small>
                    </td>
                    <td>
                      {(order.orderedItems || []).map((item, index) => (
                        <div key={index}>{item.quantity} × {item.name}</div>
                      ))}
                    </td>
                    <td className="text-nowrap">{Number(order.amount).toFixed(2)} €</td>
                    <td><span className={`badge ${payment.className}`}>{payment.label}</span></td>
                    <td>
                      <select className="form-select form-select-sm" value={order.orderStatus || 'PENDING'}
                        onChange={(e) => changeStatus(order.id, e.target.value)}>
                        {ORDER_STATUSES.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders;
