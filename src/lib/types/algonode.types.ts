export interface AlgoNodeAccount {
    address: string;
    amount: number;
    "amount-without-pending-rewards": number;
    "apps-local-state": AppLocalState[];
    "apps-total-extra-pages": number;
    "apps-total-schema": {
      "num-byte-slice": number; 
      "num-uint": number;
    };
    assets: Asset[];
    "auth-addr": string;
    "created-apps": CreatedApp[];
    "created-assets": CreatedAsset[];
    "min-balance": number;
    participation: Participation;
    "pending-rewards": number; 
    "reward-base": number;
    rewards: number;
    round: number;
    "sig-type": string;
    status: string;
    "total-apps-opted-in": number;
    "total-assets-opted-in": number; 
    "total-box-bytes": number;
    "total-boxes": number;
    "total-created-apps": number;
    "total-created-assets": number;  
  }
  
  interface AppLocalState {
    id: number;
    "key-value": KeyValuePair[];
    schema: {
      "num-byte-slice": number;
      "num-uint": number;    
    };
  }
  
  interface KeyValuePair {
    key: string;
    value: Value;  
  }
  
  interface Value {
    bytes: string;
    type: number;
    uint: number;
  }
  
  interface Asset {
    amount: number; 
    "asset-id": number;
    "is-frozen": boolean;
  }
  
  interface CreatedApp {
    id: number;
    params: AppParams;
  }
  
  interface AppParams {
    "approval-program": string;
    "clear-state-program": string;  
    creator: string;
    "extra-program-pages": number; 
    "global-state": GlobalState[];
    "global-state-schema": {
      "num-byte-slice": number;
      "num-uint": number;
    };
    "local-state-schema": {
      "num-byte-slice": number;
      "num-uint": number;
    };  
  }
  
  interface GlobalState {
    key: string;
    value: Value;
  }
  
  interface CreatedAsset {
    index: number;
    params: AssetParams;  
  }
  
  interface AssetParams {
    clawback: string;
    creator: string;
    decimals: number;
    "default-frozen": boolean;
    freeze: string;
    manager: string;  
    "metadata-hash": string;
    name: string;
    "name-b64": string;
    reserve: string;  
    total: number;
    "unit-name": string;
    "unit-name-b64": string;
    url: string;
    "url-b64": string;
  }
  
  interface Participation {
    "selection-participation-key": string;
    "state-proof-key": string;
    "vote-first-valid": number;
    "vote-key-dilution": number;
    "vote-last-valid": number;
    "vote-participation-key": string;  
  }
  