import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [sdkReady, setSdkReady] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const addBongloyScript = async () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://js.bongloy.com/v3`;
      script.async = true;
      script.onload = () => {
        scriptLoaded();
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    const scriptLoaded = () => {
      window.Bongloy.setPublishableKey(
        'pk_test_kYhpd31VBlcHPWrIJKpyH08RLUPrD7LW_9i1hU1JNI4'
      );
    };

    if (!window.Bongloy) {
      addBongloyScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardObject = {
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc
    };

    try {
      await window.Bongloy.createToken(
        'card',
        cardObject,
        async (statusCode, response) => {
          if (statusCode === 201) {
            const { id } = response;
            await axios.post('/charge', { id });
          } else {
            // Handle error
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='App'>
      {sdkReady && <p>SDK Ready</p>}
      <form
        onSubmit={handleSubmit}
        action='/charge'
        acceptCharset='UTF-8'
        method='POST'
      >
        <input
          className='form-control hidden'
          data-name='cardToken'
          name='token'
          type='hidden'
          id='charge_token'
        />
        <input
          className='form-control string tel required'
          name='cardNumber'
          data-target='card-brand-icon'
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder='Card Number'
          type='tel'
        />
        <input
          className='form-control string tel required'
          name='expiryMonth'
          value={expiryMonth}
          onChange={(e) => setExpiryMonth(e.target.value)}
          placeholder='Expire Month'
          type='tel'
        />
        <input
          className='form-control string tel required'
          name='expiryYear'
          value={expiryYear}
          onChange={(e) => setExpiryYear(e.target.value)}
          placeholder='Expire Year'
          type='tel'
        />
        <input
          className='form-control string tel required'
          name='cardCVC'
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          maxLength='3'
          placeholder='CVC'
          type='tel'
        />
        <button className='btn btn btn-success float-right'>Buy</button>
      </form>
    </div>
  );
}
export default App;
