import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  // an empty array makes the function runs one time
  // when the component is first rendered
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // we invoke findTimeLeft immediately because
    // setInterval only calls the function after 1000
    findTimeLeft();

    // we use findTimeLeft without parenthesis so it
    // will not be invoked and pass result to setInterval
    // we want findTimeLeft to be referenced and be called every 1000 seconds
    const timerId = setInterval(findTimeLeft, 1000);

    // timerId is used for stopping the interval or timer
    // when we navigate away from the component
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        tocken={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KygVaFq2GdszQ25rZqlsFxA7SInlRZVfG6HtsWx3EYxVQE13tyfs7Hve5R3LKwsUsrrPgTTWGrNFo9mDD1iA3wP00e51JLOLD"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
