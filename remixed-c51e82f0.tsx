import React, { useState, useEffect } from 'react';
import { Gift, Plus, Search, DollarSign, Check, X, CreditCard } from 'lucide-react';

const GiftCardSystem = () => {
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [notification, setNotification] = useState(null);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const createGiftCard = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    const newCard = {
      code: generateCode(),
      initialAmount: parseFloat(amount),
      balance: parseFloat(amount),
      recipientEmail: recipientEmail || 'N/A',
      message: message || 'Enjoy your gift!',
      createdDate: new Date().toISOString(),
      status: 'active',
      transactions: []
    };

    setCards([...cards, newCard]);
    showNotification('Gift card created successfully!');
    setAmount('');
    setRecipientEmail('');
    setMessage('');
  };

  const findCard = (code) => {
    return cards.find(card => card.code === code);
  };

  const redeemCard = () => {
    if (!redeemCode || !redeemAmount) {
      showNotification('Please enter code and amount', 'error');
      return;
    }

    const card = findCard(redeemCode);
    if (!card) {
      showNotification('Gift card not found', 'error');
      return;
    }

    if (card.status === 'redeemed') {
      showNotification('Gift card already fully redeemed', 'error');
      return;
    }

    const redeemValue = parseFloat(redeemAmount);
    if (redeemValue > card.balance) {
      showNotification('Insufficient balance', 'error');
      return;
    }

    const updatedCards = cards.map(c => {
      if (c.code === redeemCode) {
        const newBalance = c.balance - redeemValue;
        return {
          ...c,
          balance: newBalance,
          status: newBalance === 0 ? 'redeemed' : 'active',
          transactions: [...c.transactions, {
            amount: redeemValue,
            date: new Date().toISOString(),
            type: 'redemption'
          }]
        };
      }
      return c;
    });

    setCards(updatedCards);
    showNotification(`Successfully redeemed $${redeemValue.toFixed(2)}`);
    setRedeemCode('');
    setRedeemAmount('');
  };

  const searchedCard = searchCode ? findCard(searchCode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full shadow-lg overflow-hidden">
              <img 
                src="https://turquoise-reasonable-penguin-388.mypinata.cloud/ipfs/bafkreiconcyyp3447jlcrmsmil6w3punwvyvoxqkzqh76uq22u5ms34amq" 
                alt="Like Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white">Like Gift Cards</h1>
          </div>
          <p className="text-gray-300">Create, manage, and redeem Like gift cards</p>
        </div>

        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center gap-2 z-50`}>
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {notification.msg}
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 mb-6 border border-slate-700">
          <div className="flex gap-2 mb-6 border-b border-slate-700">
            {['create', 'redeem', 'manage'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'create' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Create New Gift Card</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50.00"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Email (optional)
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personal Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday! Enjoy your gift..."
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={createGiftCard}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Gift Card
              </button>
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Redeem Gift Card</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gift Card Code *
                </label>
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Redeem ($) *
                </label>
                <input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  placeholder="25.00"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={redeemCard}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                Redeem Gift Card
              </button>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Manage Gift Cards</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search by Code
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    placeholder="Enter gift card code..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              {searchedCard && (
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 rounded-lg border border-orange-500/30 shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Gift Card Code</p>
                      <p className="text-lg font-mono font-bold text-white">{searchedCard.code}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      searchedCard.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                    }`}>
                      {searchedCard.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Initial Amount</p>
                      <p className="text-xl font-bold text-white">${searchedCard.initialAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current Balance</p>
                      <p className="text-xl font-bold text-orange-500">${searchedCard.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  {searchedCard.recipientEmail !== 'N/A' && (
                    <p className="text-sm text-gray-400 mb-2">Recipient: {searchedCard.recipientEmail}</p>
                  )}
                  <p className="text-sm text-gray-400">Created: {new Date(searchedCard.createdDate).toLocaleString()}</p>
                  
                  {searchedCard.transactions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-sm font-semibold text-gray-300 mb-2">Transaction History</p>
                      {searchedCard.transactions.map((t, i) => (
                        <div key={i} className="text-sm text-gray-400 flex justify-between">
                          <span>{new Date(t.date).toLocaleString()}</span>
                          <span className="font-semibold text-orange-400">-${t.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">All Gift Cards ({cards.length})</h3>
                {cards.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No gift cards created yet</p>
                ) : (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <div key={card.code} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:shadow-lg hover:border-orange-500/50 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono font-semibold text-white">{card.code}</p>
                            <p className="text-sm text-gray-400">Balance: <span className="text-orange-500 font-semibold">${card.balance.toFixed(2)}</span> / ${card.initialAmount.toFixed(2)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            card.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {card.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-3xl font-bold text-orange-500">{cards.length}</p>
              <p className="text-sm text-gray-400">Total Cards</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-3xl font-bold text-green-400">
                {cards.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-3xl font-bold text-blue-400">
                ${cards.reduce((sum, c) => sum + c.balance, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">Total Balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardSystem;