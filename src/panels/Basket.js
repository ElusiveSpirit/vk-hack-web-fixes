import React, { useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Link from '../components/Link';
import accounting from 'accounting';

import Checkbox from './Checkbox';

import edit from '../img/edit.svg';
import './place.css';


const getOptions = () => {
  const options = localStorage.getItem('orderOptions');
  return options ? JSON.parse(options) : {
    faster: true,
    time: '',
    selfService: false,
  };
}

const saveOptions = options => {
  localStorage.setItem('orderOptions', JSON.stringify(options));
}

const Basket = ({ match: { params: { areaId, itemId }}, foodAreas, order }) => {
  const options = getOptions();
  const [ faster, setFaster ] = useState(options.faster);
  const [ time, setTime ] = useState(options.time);
  const [ selfService, setSelfService ] = useState(options.selfService);
  const setFasterStorage = v => {
    setFaster(v)
    saveOptions({
      ...options,
      faster: v
    })
  }
  const setTimeStorage = v => {
    setTime(v)
    saveOptions({
      ...options,
      time: v
    })
  }
  const setSelfServiceStorage = v => {
    setSelfService(v)
    saveOptions({
      ...options,
      selfService: v
    })
  }
  const area = foodAreas.filter(area => area.id === areaId)[0];
  const item = area.items.filter(item => item.id === itemId)[0];

  const [ price, products ] = useMemo(() => {
    const foodIds = new Set((item.foods || []).map(item => item.id));

    const products = Object.values(order)
      .filter((value) => {
        const { item: { id }} = value;

        return foodIds.has(id);
      });

    const result = products.reduce((result, value) => {
        const { count, item } = value;

        return result + parseInt(item.price) * parseInt(count);
      }, 0);

    return [ accounting.formatNumber(result, 0, ' '), products ];
  }, [ order, item ]);
  const emptyBasket = products.length === 0;

  return (
    <div className="Place">
      <header className="Place__header">
        <aside className="Place__trz">
          <h1 className="Place__head">
            <Link to="/" className="Place__logo">
              {area.name}
            </Link>
          </h1>
          <Link to="/edit" className="Place__change-tz">
            <img
              alt="change-profile"
              src={edit}
            />
          </Link>
        </aside>
      </header>
      <aside className="Place__restoraunt">
        <img
          className="Place__restoraunt-logo"
          alt="Fastfood logo"
          src={item.image}
        />
        <h2
          className="Place__restoraunt-name"
        >
          {item.name}
        </h2>
        <p className="Place__restoraunt-type">
          {item.description}
        </p>
      </aside>
      <div className="Place__products-wrapper">
        <ul className="Place__products">
          {products.map(({ item, count }) => (
            <li
              className="Place__product"
              key={item.id}
            >
              <img
                className="Place__product-logo"
                alt="Ordered product logo"
                src={item.image}
              />
              <h3
                className="Place__product-name"
              >
                {item.name}
              </h3>
              <p
                className="Place__product-price"
              >
                Цена: {item.price}
              </p>
              <p
                className="Place__product-count"
              >
                x{count}
              </p>
            </li>
          ))}
        </ul>
        <Link
          className="Place__change-product"
          to={`/place/${areaId}/${itemId}`}
        >
          Изменить
        </Link>
      </div>
      <div className="Place__choice">
        <h3>Время:</h3>
        <div className="Place__choice-item">
          <span>Как можно быстрее</span>
          <Checkbox 
            checked={faster} 
            onToggle={() => {
              if (faster) {
                setFasterStorage(false);
              } else {
                setTimeStorage('');
                setFasterStorage(true);
              }
            }}
          />
        </div>
        <div className="Place__choice-item">
          <span>Назначить</span>
          <input
            value={time}
            type={'time'}
            onFocus={() => {
              setFasterStorage(false);
            }}
            onChange={event => {
              setFasterStorage(false);
              setTimeStorage(event.target.value);
            }}
            onBlur={() => {
              if (time) {
                setFasterStorage(false);
              }
            }}
          />
        </div>
        <div className="Place__choice-item">
          <h3>С собой</h3>
          <Checkbox checked={selfService} onToggle={() => setSelfServiceStorage(!selfService)} />
        </div>
        <div className="Place__choice-item">
          <h3>На месте</h3>
          <Checkbox checked={!selfService} onToggle={() => setSelfServiceStorage(!selfService)} />
        </div>
      </div>
      <footer className="Place__footer">
        <Link
            to={`/order/${area.id}/${item.id}`}
            disabled={emptyBasket}
            className="Place__order"
        >
          Оплатить {price}
        </Link>
      </footer>
    </div>
  );
};

export default withRouter(Basket);
