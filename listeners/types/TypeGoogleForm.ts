interface GoogleForm {
  formId: string;
  entryIds: {
    user: string;
    horodateur: string;
    periode: string;
    presence: string;
    competence: string;
    note: string;
  };
}

const formState = new Map<string, GoogleForm>();

export {GoogleForm, formState}