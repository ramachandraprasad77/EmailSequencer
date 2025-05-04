import { useEffect, useState } from "react";
import EmailFields from "./fields/EmailFields";
import DelayFields from "./fields/DelayFields";
import LeadSourceFields from "./fields/LeadSourceFields";
import { getTitle } from "../../utils/getTitle";

const AddPopover = ({
  node,
  onClose,
  onSubmit,
  onAddNode,
  onDelete,
  canAddEmail,
  canAddDelay,
  canDelete,
}) => {
  const [formData, setFormData] = useState({
    leadSource: "Email",
    email: "",
    subject: "",
    body: "",
    delay: "1",
    delayUnit: "days",
  });

  useEffect(() => {
    setFormData({
      leadSource: node?.data?.leadSource || "Email",
      email: node?.data?.email || "",
      subject: node?.data?.subject || "",
      body: node?.data?.body || "",
      delay: node?.data?.delay || "1",
      delayUnit: node?.data?.delayUnit || "days",
    });
  }, [node]);

  const handleSave = () => {
    const { leadSource, email, subject, body, delay, delayUnit } = formData;
    const base = { type: node.data.type };
    let updatedData = {};

    switch (node.data.type) {
      case "leadSource":
        updatedData = { ...base, leadSource };
        break;
      case "email":
        updatedData = { ...base, email, subject, body };
        break;
      case "delay":
        updatedData = { ...base, delay, delayUnit };
        break;
      default:
        console.warn("Unknown node type");
        onClose();
        return;
    }

    onSubmit(node.id, updatedData);
    onClose();
  };

  const renderFields = () => {
    switch (node?.data?.type) {
      case "leadSource":
        return (
          <LeadSourceFields
            leadSource={formData.leadSource}
            onChange={(val) => setFormData((prev) => ({ ...prev, leadSource: val }))}
            canAddEmail={canAddEmail}
            onAddNode={() => {
              onAddNode(node, "email");
              onClose();
            }}
          />
        );
      case "email":
        return (
          <EmailFields
            email={formData.email}
            subject={formData.subject}
            body={formData.body}
            onChange={(key, val) => setFormData((prev) => ({ ...prev, [key]: val }))}
            canAddDelay={canAddDelay}
            canDelete={canDelete}
            onDelete={() => {
              onDelete(node.id);
              onClose();
            }}
            onAddDelay={() => {
              onAddNode(node, "delay");
              onClose();
            }}
          />
        );
      case "delay":
        return (
          <DelayFields
            delay={formData.delay}
            delayUnit={formData.delayUnit}
            onChange={(key, val) => setFormData((prev) => ({ ...prev, [key]: val }))}
            canDelete={canDelete}
            onDelete={() => {
              onDelete(node.id);
              onClose();
            }}
          />
        );
      default:
        return <p className="text-red-500">Unknown node type</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 bg-opacity-5">
      <div className="bg-white shadow-xl rounded-xl p-6 w-[65%] h-[80%] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold">{getTitle(node?.data?.type)}</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
  
        <div className="mb-6">{renderFields()}</div>
  
        <div className="flex justify-end space-x-2 border-t pt-3">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPopover;