import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AddPopover from "../components/AddPopover/AddPopover";
import useAxios from "../hooks/useAxios";

const LEAD_SOURCE_ID = "node-leadSource";
const EMAIL_ID = "node-email";
const DELAY_ID = "node-delay";

const LEAD_SOURCE_POS = { x: 250, y: 50 };
const EMAIL_POS = { x: 250, y: 200 };
const DELAY_POS = { x: 250, y: 350 };

const SequenceBuilder = () => {
  const user = localStorage.getItem("schedulerUserName");
  if (!user) {
    window.location.href = "/signin";
  }

  const axios = useAxios();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const containerRef = useRef(null);

  const leadSourceNode = nodes.find((n) => n.id === LEAD_SOURCE_ID);
  const emailNode = nodes.find((n) => n.id === EMAIL_ID);
  const delayNode = nodes.find((n) => n.id === DELAY_ID);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    if (!leadSourceNode) {
      const initialLeadNode = {
        id: LEAD_SOURCE_ID,
        data: { label: "Lead Source", type: "leadSource", leadSource: "Email" },
        position: LEAD_SOURCE_POS,
        deletable: false,
      };
      setNodes([initialLeadNode]);
      setEdges([]);
    }
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId, updatedData) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updatedData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const handlePopoverAddNode = useCallback(
    (sourceNode, newNodeType) => {
      let newNode = null;
      let newEdge = null;

      if (sourceNode.id === LEAD_SOURCE_ID && newNodeType === "email" && !emailNode) {
        newNode = {
          id: EMAIL_ID,
          position: EMAIL_POS,
          data: { type: "email", label: "Email Step", email: "", subject: "", body: "" },
        };
        newEdge = {
          id: `e-${LEAD_SOURCE_ID}-${EMAIL_ID}`,
          source: LEAD_SOURCE_ID,
          target: EMAIL_ID,
          animated: true,
        };
      } else if (sourceNode.id === EMAIL_ID && newNodeType === "delay" && !delayNode) {
        newNode = {
          id: DELAY_ID,
          position: DELAY_POS,
          data: { type: "delay", label: "Delay Step", delay: "1", delayUnit: "days" },
        };
        newEdge = {
          id: `e-${EMAIL_ID}-${DELAY_ID}`,
          source: EMAIL_ID,
          target: DELAY_ID,
          animated: true,
        };
      } else {
        console.warn(`Invalid node addition request: from ${sourceNode.data.type} add ${newNodeType}`);
        return;
      }

      if (newNode) setNodes((nds) => [...nds, newNode]);
      if (newEdge) setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges, emailNode, delayNode]
  );

  const deleteNode = useCallback(
    (nodeIdToDelete) => {
      if (nodeIdToDelete === LEAD_SOURCE_ID) {
        console.warn("Cannot delete the Lead Source node.");
        return;
      }

      let nodesToRemove = [nodeIdToDelete];

      if (nodeIdToDelete === EMAIL_ID && delayNode) {
        nodesToRemove.push(DELAY_ID);
      }

      setNodes((nds) => nds.filter((n) => !nodesToRemove.includes(n.id)));
      setEdges((eds) =>
        eds.filter((e) => !nodesToRemove.includes(e.source) && !nodesToRemove.includes(e.target))
      );

      setSelectedNodeId(null);
    },
    [setNodes, setEdges, delayNode]
  );

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleSaveSequence = async () => {
    const emailData = emailNode?.data || {};
    const delayData = delayNode?.data || {};

    if (!emailData.email || !emailData.subject || !emailData.body || !delayData.delay || !delayData.delayUnit) {
      alert("Please complete all required fields.");
      return;
    }

    const delayValue = parseInt(delayData.delay, 10);
    const unit = delayData.delayUnit;
    let delayInMs = 0;

    switch (unit) {
      case "minutes":
        delayInMs = delayValue * 60 * 1000;
        break;
      case "hours":
        delayInMs = delayValue * 60 * 60 * 1000;
        break;
      case "days":
      default:
        delayInMs = delayValue * 24 * 60 * 60 * 1000;
    }

    const sendAt = new Date(Date.now() + delayInMs).toISOString();
    const payload = {
      email: emailData.email,
      subject: emailData.subject,
      body: emailData.body,
      sendAt,
    };

    try {
      const response = await axios.post("/email/schedule", payload);
      console.log(response.data);
      alert("Sequence saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving sequence.");
    }
  };

  return (
    <div className="h-[90vh] w-full relative bg-gray-100 p-4" ref={containerRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setSelectedNodeId(null)}
        nodesDraggable={true}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>

      {selectedNode && (
        <AddPopover
          key={selectedNode.id}
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onSubmit={handleNodeUpdate}
          onAddNode={handlePopoverAddNode}
          onDelete={deleteNode}
          canAddEmail={!!leadSourceNode && !emailNode}
          canAddDelay={!!emailNode && !delayNode}
          canDelete={selectedNodeId === EMAIL_ID || selectedNodeId === DELAY_ID}
        />
      )}

      <button
        onClick={handleSaveSequence}
        className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
      >
        Save Sequence
      </button>
    </div>
  );
};

export default SequenceBuilder;