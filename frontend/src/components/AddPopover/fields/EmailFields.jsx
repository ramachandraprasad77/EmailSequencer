import FormField from "../FormField";

const EmailFields = ({ email, subject, body, onChange, canAddDelay, canDelete, onAddDelay, onDelete }) => (
  <>
    <FormField id="email" label="To" value={email} onChange={(e) => onChange("email", e.target.value)} />
    <FormField id="subject" label="Subject" value={subject} onChange={(e) => onChange("subject", e.target.value)} />
    <FormField id="body" label="Body" type="textarea" value={body} onChange={(e) => onChange("body", e.target.value)} rows={4} />

    <div className="mt-4 space-y-2">
      {canAddDelay && (
        <button onClick={onAddDelay} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded text-sm">
          Add Delay Step
        </button>
      )}
      {canDelete && (
        <button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm">
          Delete Email Step
        </button>
      )}
    </div>
  </>
);
export default EmailFields;