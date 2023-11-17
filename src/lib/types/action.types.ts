export type ActionResult = {
    success: true;
    data: string;
};

export type ActionError = {
    success: false;
    errorMessage: string;
};

export type ActionResponse = ActionResult | ActionError;