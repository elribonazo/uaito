import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';


type PricingTableProps = {
  pricingTableId: string,
  publishableKey: string,
}

const StripePricingTable: React.FC<PricingTableProps> = (props: PricingTableProps) => {
  const session = useSession()
  const tableRef = useRef(null);

  useEffect(() => {
    // Load the Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const userEmail = session.data?.user?.email;

      (tableRef.current as any).setAttribute('pricing-table-id',props.pricingTableId);
      (tableRef.current as any).setAttribute('publishable-key', props.publishableKey);
      if (userEmail) {
        (tableRef.current as any).setAttribute('customer-email', userEmail)
      }
    }
  }, []);
  const AAA = 'stripe-pricing-table' as any
  return <AAA ref={tableRef}></AAA>;
};

export default StripePricingTable;