import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { isEmpty } from 'ramda';
import React, { FC, createContext, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import Modal from '../components/elements/Modal';
import { None } from '../components/forms/OfferForm';

type AsyncFunction = (arg?: any) => Promise<void>;
export type Action = {
  name: string;
  id: string;
  action: AsyncFunction;
  param: any;
};

interface ActionSettings {
  onComplete?: () => void;
  onActionSuccess?: (txName: string) => void;
  onActionFailure?: () => void;
}

interface MultiTransactionState {
  hasActionPending: boolean;
  hasRemainingActions: boolean;
  actions: Action[];
  runActions: (actions: Omit<Action, 'id'>[], settings?: ActionSettings) => Promise<void>;
  retryActions: (settings?: ActionSettings) => Promise<void>;
  clearActions: () => void;
  onFinished?: () => void;
  onStart?: () => void;
}

const defaultState: MultiTransactionState = {
  hasRemainingActions: false,
  hasActionPending: false,
  actions: [],
  clearActions: () => {},
  runActions: async ([]) => {},
  retryActions: async () => {},
};

export const MultiTransactionContext = createContext<MultiTransactionState>(defaultState);

export const MultiTransactionProvider: FC = ({ children }) => {
  const [hasActionPending, setHasActionPending] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [numActions, setNumActions] = useState(0);
  const [hasRemainingActions, setHasRemainingActions] = useState(false);
  const [message, setMessage] = useState<string>(`Sign the message in your wallet to continue`);

  const clearActions = () => {
    setActions([]);
    setHasActionPending(false);
    setNumActions(0);
  };

  const retryActions = async (settings?: ActionSettings) => {
    setNumActions(actions.length);

    if (actions.length <= 0) {
      // no actions
      return;
    }
    if (!hasActionPending) {
      try {
        setHasActionPending(true);
        let filtered = actions;
        for (const action of actions) {
          await action.action(action.param);
          settings?.onActionSuccess?.(action.id);
          // clear action
          filtered = filtered.filter((x) => x.id !== action.id);
          setActions(filtered);
        }
        setHasRemainingActions(false);
        setHasRemainingActions(false);
      } catch (err: any) {
        const errorMsg: string = err.message;
        if (errorMsg.includes(`User rejected the request`)) {
          setActions([]);
        }
        toast.error(err.message);
        settings?.onActionFailure?.();
        setHasActionPending(false);
      } finally {
        setHasActionPending(false);
        settings?.onComplete?.();
      }
    }
  };

  const runActions = async (newActions: Omit<Action, 'id'>[], settings?: ActionSettings) => {
    if (hasRemainingActions) {
      throw new Error(`Has pending actions from a previous transaction`);
    }
    const newActionsWithIds: Action[] = newActions.map((action) => {
      return {
        ...action,
        id: v4(),
      };
    });

    if (!hasActionPending && !hasRemainingActions) {
      setActions(actions.concat(newActionsWithIds));
      setNumActions(newActionsWithIds.length);

      if (newActionsWithIds.length <= 0) {
        // no actions
        return;
      }
      try {
        setHasRemainingActions(true);
        setHasActionPending(true);
        let filtered = newActionsWithIds;
        for (const action of newActionsWithIds) {
          await action.action(action.param);
          settings?.onActionSuccess?.(action.id);
          // clear action
          filtered = filtered.filter((x) => x.id !== action.id);
          setActions(filtered);
        }
        setHasRemainingActions(false);
      } catch (err: any) {
        const errorMsg: string = err.message;
        if (errorMsg.includes(`User rejected the request`)) {
          setActions([]);
          setHasRemainingActions(false);
        }
        toast.error(err.message);
        settings?.onActionFailure?.();
        setHasActionPending(false);
      } finally {
        setHasActionPending(false);
        settings?.onComplete?.();
      }
    }
  };

  const completedActions = numActions - actions.length;
  const percentage =
    completedActions > 0 && numActions > 0 ? (completedActions / numActions) * 100 : 0;

  return (
    <MultiTransactionContext.Provider
      value={{
        hasRemainingActions,
        hasActionPending,
        actions,
        runActions,
        retryActions,
        clearActions,
      }}
    >
      <Modal
        title={`Please wait`}
        open={hasRemainingActions}
        setOpen={setHasRemainingActions}
        priority={true}
      >
        <div className={`mt-8`}>
          <p className={`text-center`}>{message}</p>
        </div>
        <div className={`mt-8`}>
          <div className={`h-2 w-full rounded-full bg-gray-800`}>
            <div
              className={`relative flex h-full rounded-full`}
              style={{ width: `${percentage}%` }}
            >
              <div
                className={`relative flex h-full animate-loading rounded-full bg-gray-300`}
              ></div>
            </div>
          </div>
          <p className={`mt-4 text-center text-gray-300`}>
            {completedActions} of {numActions}
          </p>
        </div>
      </Modal>
      {/* {hasRemainingActions && (
        <div className={`fixed bottom-0 flex h-8 w-screen bg-gray-700`} style={{ zIndex: 2001 }}>
          <div
            className={`relative animate-pulse rounded-r-md bg-green-400 ease-in`}
            style={{ width: `${(completedActions / numActions) * 100}%` }}
          >
            <div
              className={`relative flex h-full items-center whitespace-nowrap px-2 text-sm ${
                completedActions > 0 ? `text-gray-800` : `text-white`
              }`}
            >
              <p className={`mb-0 font-semibold`}>
                {completedActions}/{numActions} Completed Transactions
                {!hasActionPending && (
                  <span
                    className={`ml-2 cursor-pointer font-bold text-blue-500 hover:text-blue-700`}
                    onClick={() => retryActions()}
                  >
                    Retry?
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )} */}

      {children}
    </MultiTransactionContext.Provider>
  );
};
