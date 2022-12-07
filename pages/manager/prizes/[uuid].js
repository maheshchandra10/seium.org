import { useState, useEffect } from "react";

import { withAuth, useAuth } from "@context/Auth";
import { useRouter } from "next/router";

import * as api from "/lib/api";

import Base from "/components/moonstone/staff/utils/Base";
import Button from "/components/moonstone/utils/Button";

const navigation = ["badges", "prizes", "identifier"];

function ManagerRedeemables() {
  const router = useRouter();
  const { uuid } = router.query;
  const [refresh, setRefresh] = useState(false);
  const [redeemables, setRedeemables] = useState(null);
  const [redeemablesAmount, setRedeemablesAmount] = useState(null);
  const [wheelRedeemables, setWheelRedeemables] = useState(null);
  const [wheelRedeemablesAmount, setWheelRedeemablesAmount] = useState(null);
  const [tab, updateTab] = useState(true);

  useEffect(() => {
    api.getReedemable(uuid).then((response) => {
      setRedeemables(response.data);
      setRedeemablesAmount(new Array(response.data.length).fill(0));
    });
    api.getWheelRedeemables(uuid).then((response) => {
      setWheelRedeemables(response.data);
      setWheelRedeemablesAmount(new Array(response.data.length).fill(0));
    });
  }, [refresh]);

  const redeemRedeemables = (prize_id, quantity) => {
    api
      .redeem(uuid, prize_id, quantity)
      .then(() => {
        alert("Redeemed!");
        setRefresh(!refresh);
      })
      .catch(() => {
        alert("Can't redeem!");
        setRefresh(!refresh);
      });
  };

  const redeemWheelRedeemables = (prize_id, quantity) => {
    api
      .redeemWheel(uuid, prize_id, quantity)
      .then(() => {
        alert("Redeemed!");
        setRefresh(!refresh);
      })
      .catch(() => {
        alert("Can't redeem!");
        setRefresh(!refresh);
      });
  };

  return (
    <Base
      href="prizes"
      title="Prizes"
      description="Mark a prize as redeemed"
      navigation={navigation}
    >
      <div className="mt-5">
        <button
          className={`font-iregular bg-${
            tab ? "quinary" : "white"
          } h-12 items-center rounded-full px-4 py-1 text-center`}
          onClick={(e) => {
            updateTab(true);
          }}
        >
          STORE
        </button>
        <button
          className={`font-iregular bg-${
            tab ? "white" : "quinary"
          } ml-12 h-12 items-center rounded-full px-4 py-1 text-center`}
          onClick={(e) => {
            updateTab(false);
          }}
        >
          WHEEL
        </button>
      </div>

      {tab ? (
        <div>
          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            {redeemables &&
              redeemablesAmount &&
              redeemables.map((product, index) => (
                <li key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <div className="font-medium text-gray-700 hover:text-gray-800">
                            {product.name}
                          </div>
                        </h4>
                      </div>

                      <p className="mt-4 truncate text-sm font-medium text-gray-600"></p>
                    </div>
                  </div>
                  <div className="w-32">
                    <Button
                      onClick={() => {
                        redeemRedeemables(product.id, product.not_redeemed);
                      }}
                    >
                      REDEEM {product.not_redeemed}
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>
          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            {wheelRedeemables &&
              wheelRedeemablesAmount &&
              wheelRedeemables.map((product, index) => (
                <li key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <div className="font-medium text-gray-700 hover:text-gray-800">
                            {product.name}
                          </div>
                        </h4>
                      </div>

                      <p className="mt-4 truncate text-sm font-medium text-gray-600"></p>
                    </div>
                  </div>
                  <div className="w-32">
                    <Button
                      onClick={() => {
                        redeemWheelRedeemables(
                          product.id,
                          product.not_redeemed
                        );
                      }}
                    >
                      REDEEM {product.not_redeemed}
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Base>
  );
}

export default withAuth(ManagerRedeemables);
