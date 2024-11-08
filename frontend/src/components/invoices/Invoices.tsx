// InvoiceList.js (updated with pagination)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import Message from '../message/Message';
import { formatDate } from '../../utils/formatDate';

interface InvoicesProps {
  user: any;
}

interface Invoice {
  id: number;
  number: string;
  amount: number;
  currency: string;
  status: string;
  state: string;
  client_key: string;
  line_items: any;
  sent_at: string;
  due_date: string;
  subject: string;
}

const Invoices: React.FC<InvoicesProps> = ({ user }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllInvoices = async () => {
    let allInvoices = [] as any;
    let page = 1;
    const perPage = 100;
    let totalPages = 1;

    try {
      while (page <= totalPages) {
        const response = await axios.get('https://api.harvestapp.com/v2/invoices', {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_HARVEST_ACCESS_TOKEN}`,
            'Harvest-Account-ID': process.env.REACT_APP_HARVEST_ACCOUNT_ID,
            'Content-Type': 'application/json',
          },
          params: {
            page: page,
            per_page: perPage,
          },
        });

        allInvoices = allInvoices.concat(response.data.invoices);

        const totalRecords = response.data.total_entries;
        totalPages = Math.ceil(totalRecords / perPage);
        page += 1;
      }

      setInvoices(allInvoices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Message message={error} type="error" />;
  }

  return (
    <div>
      <h1 className="text-3xl mb-8">Invoices</h1>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <div>
          {invoices.map((invoice) => (
            <div className="mb-4" key={invoice.id}>
              <div className="border-lg bg-blue-800 text-white p-4 rounded-tl-lg rounded-tr-lg">
                Invoice #{invoice.number}
              </div>
              <div className="p-4 shadow-lg rounded-bl-lg rounded-br-lg">
                <div className="mb-4">
                  <table>
                    <tbody>
                      <tr>
                        <td className="text-gray-800 font-bold" style={{ width: '100px' }}>Issue Date</td>
                        <td>{formatDate(invoice.sent_at)}</td>
                      </tr>
                      <tr>
                        <td className="w-100 text-gray-800 font-bold" style={{ width: '100px' }}>Due Date</td>
                        <td>
                          <span>
                            {formatDate(invoice.due_date)}
                            <small className="pl-1">
                              (upon receipt)
                            </small>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-100 text-gray-800 font-bold" style={{ width: '100px' }}>Subject</td>
                        <td>{invoice.subject ? invoice.subject : 'None'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <table className="table-auto w-full">
                  <thead className="text-left">
                    <tr>
                      <th className="w-1/7 text-gray-800">Item Type</th>
                      <th className="w-3/5 text-gray-800">Description</th>
                      <th className="w-1/7 text-gray-800 text-right">Quantity</th>
                      <th className="w-1/7 text-gray-800 text-right">Unit Price</th>
                      <th className="w-1/7 text-gray-800 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.line_items.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.kind}</td>
                        <td>{item.description}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">${item.unit_price}</td>
                        <td className="text-right">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t-2">
                  {
                    invoice.state === 'open'
                      ? (
                        <div className="flex items-center justify-between">
                          <span className="bg-red-700 text-white rounded-lg py-1 px-3">Unpaid</span>
                          <a href={`https://${process.env.REACT_APP_HARVEST_COMPANY}.harvestapp.com/client/invoices/${invoice.client_key}`} className="py-2 px-4 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" target="_blank" rel="noreferrer">Pay now</a>
                        </div>
                      )
                      : (
                        <span className="bg-green-700 text-white rounded-lg py-1 px-3">Paid</span>
                      )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
