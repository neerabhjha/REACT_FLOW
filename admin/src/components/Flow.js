import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  MarkerType,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Triggers from "./SideBar/Triggers";
import Actions from "./SideBar/Actions";
import { Modal } from "antd";
import shortid from "shortid";
import { OpenMailer, setEmailId } from "../redux/slices/EmailSlice";
import {
  increaseEdgeCount,
  decreaseEdgeCount,
  setEdgeCount,
} from "../redux/slices/EdgeCount";
import {
  setEventData,
  setDeleteState,
  callEventFunction,
} from "../redux/slices/EventSlice";
import toast, { Toaster } from "react-hot-toast";
import RemoveJourney from "../components/CustomNode/RemoveJourney";
import {
  FormSubmitNode,
  FormUpdateNode,
} from "../components/CustomNode/Form/EventNode";
import EmailNode from "../components/CustomNode/EmailNode";
import TriggerNode from "./CustomNode/TriggerNode";
import ContextMenu from "./ContextMenu/ContextMenu";
import EmailSentNode from "./CustomNode/EmailSentNode";
import { FormUpdatedNode } from "./CustomNode/Form/FormUpdatedNode";
import { FormNotUpdatedNode } from "./CustomNode/Form/FormNotUpdatedNode";
import { FormSubmittedNode } from "./CustomNode/Form/FormSubmittedNode";
import { FormNotSubmittedNode } from "./CustomNode/Form/FormNotSubmittedNode";

const nodeTypes = {
  emailNode: EmailNode,
  triggerNode: TriggerNode,
  formUpdateNode: FormUpdateNode,
  formSubmitNode: FormSubmitNode,
  formSubmittedNode: FormSubmittedNode,
  formNotSubmittedNode: FormNotSubmittedNode,
  formUpdatedNode: FormUpdatedNode,
  formNotUpdatedNode: FormNotUpdatedNode,
  removeJourney: RemoveJourney,
  emailSentNode: EmailSentNode,
};

let y = 200;
const getY = () => (y += 100);

const flowKey = "example-flow";

const defaultEdgeOptions = {
  style: { strokeWidth: 3 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "blue",
  },
  type: "smoothstep",
};

const Flow = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [actionDraggable, setActionDraggable] = useState(false);
  const [emailDraggable, setEmailDraggable] = useState(true);
  const [deleteNodeId, setDeleteNodeId] = useState("");
  const [addToCart, setAddToCart] = useState(true);
  const [removeJourneyState, setRemoveJourneyState] = useState(false);
  const [intervalState, setIntervalState] = useState(false);
  const [flowActivator, setFlowActivator] = useState(false);
  const [formUpdated, setFormUpdated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  // const [contextMenuPosition, setContextMenuPosition] = useState({
  //   x: 0,
  //   y: 0,
  // });
  const [nodeColorState, setNodeColorState] = useState(false);
  const intervalIdRef = useRef(null);
  const { setViewport } = useReactFlow();
  const dispatch = useDispatch();
  const { eventData, eventState, deleteState } = useSelector(
    (state) => state.eventReducer
  );
  const { emailData, emailSubmitState } = useSelector(
    (state) => state.emailReducer
  );
  const { edgeCount } = useSelector((state) => state.edgeCountReducer);

  const showSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const handleSaveCancel = () => {
    setIsSaveModalOpen(false);
  };

  const showRestoreModal = () => {
    setIsRestoreModalOpen(true);
  };

  const handleRestoreCancel = () => {
    setIsRestoreModalOpen(false);
  };

  //internal function to create new edge on connect
  const newEdgeCreater = useCallback(
    (params, label) => {
      const newEdge = {
        id: shortid.generate(),
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        label,
      };
      setEdges((eds) => eds.concat(newEdge));
    },
    [setEdges]
  );

  //calling newEdgeCreater and managing state of 'Email' node on connection between two nodes
  const onConnect = useCallback(
    (params) => {
      console.log("onConnect", params);
      if (params.targetHandle === "email-t-t") {
        newEdgeCreater(params, "Timeout");
        dispatch(OpenMailer(true));
        return;
      }
      newEdgeCreater(params, "Yes");
    },
    [newEdgeCreater, dispatch]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  //function called after a node is dropped on the flow
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      //setting position for the new node
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      //calling internal function to create new node
      if (type === "triggerNode") {
        newNodeCreater(shortid.generate(), type, position, "Form Sent Out");
        setActionDraggable(true);
        return;
      }
      if (type === "emailNode") {
        const newId = shortid.generate();
        newNodeCreater(newId, type, position, {});
        dispatch(setEmailId(newId));
        dispatch(increaseEdgeCount());
        // setEmailDraggable(false);
        // setEmailSubmitState(false);
        return;
      }
      if (type === "removeJourney") {
        newNodeCreater(
          shortid.generate(),
          type,
          position,
          "Remove from journey"
        );
        dispatch(increaseEdgeCount());
        return;
      }
    },
    [reactFlowInstance, emailData, emailDraggable]
  );

  // creating new 'Event' node
  const onEventSubmit = useCallback(() => {
    // console.log(`Event from App.js: ${eventName} , ${eventTime}`);

    newNodeCreater(
      eventData[eventData.length - 1].eventId,
      `${eventData[eventData.length - 1].eventName}Node`,
      { x: 200, y: getY() },
      eventData[eventData.length - 1]
    );
    dispatch(increaseEdgeCount());
    setEmailDraggable(true);
  }, [eventData]);

  //internal function to create a new node on drag
  const newNodeCreater = useCallback(
    (id, type, position, label) => {
      const newNode = {
        id,
        type,
        position,
        label,
      };
      setNodes((nds) => nds.concat(newNode));
      setNodeColorState(true);
      return;
    },
    [reactFlowInstance]
  );

  //getting node data after clicking on the node
  const handleNodeClick = useCallback((event, nodeData) => {
    if (nodeData.type === "formSubmitNode" || nodeData.type === "formUpdateNode") {
      setDeleteNodeId(nodeData.id);
    }
    console.log(nodeData);
  }, []);

  const handleEdgeClick = useCallback((event, edgeData) => {
    if (edgeData.targetHandle === "remove-t-l") {
    }
    console.log(edgeData);
  }, []);

  // managing state for new 'Event' node creater function.
  useEffect(() => {
    // console.log("nodes from effect: ", nodes);
    // console.log("Edges : ", edges);
    if (deleteState) {
      const updatedNodes = nodes.filter((node) => node.id !== deleteNodeId);
      const updatedEventData = eventData.filter(
        (event) => event.eventId !== deleteNodeId
      );
      dispatch(setEventData(updatedEventData));
      setNodes(updatedNodes);
      dispatch(setDeleteState(false));
      dispatch(decreaseEdgeCount());
      toast.success("Deleted Successfully!");
      // setEdges([]);
      return;
    }
    // console.log(edgeCount);
    if (eventState) {
      onEventSubmit();
      dispatch(callEventFunction(false));
      return;
    }

    // handling state before reloading the site.
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome compatibility
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    eventState,
    onEventSubmit,
    nodes,
    deleteState,
    setNodes,
    edges,
    edgeCount,
    setEventData,
    eventData,
  ]);

  // saving the whole react flow
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      // console.log(reactFlowInstance);
      let flow = reactFlowInstance.toObject();
      console.log("flow : ", flow);
      console.log("nodes: ", nodes);

      // console.log(updatedFlow);
      if (flow) {
        //checking if the nodes in the flow is empty
        if (Array.isArray(flow.nodes) && !flow.nodes.length) {
          toast.error("No data found.");
          setIsSaveModalOpen(false);
          return;
        }

        let hasEventNode = false;
        for (const node of flow.nodes) {
          if (
            node.type === "formSubmitNode" ||
            node.type === "formUpdateNode"
          ) {
            hasEventNode = true;
            break;
          }
        }

        if (!hasEventNode) {
          toast.error("Select an event first!");
          setIsSaveModalOpen(false);
          return;
        }

        if (edges.length < edgeCount) {
          // console.log(edgeCount);
          toast.error("All Nodes should be connected.");
          setIsSaveModalOpen(false);
          return;
        }

        const emailNodeCount = flow.nodes.filter(
          (node) => node.type === "emailNode"
        );
        const eventNodeCount = flow.nodes.filter(
          (node) =>
            node.type === "formSubmitNode" || node.type === "formUpdateNode"
        );
        if (emailNodeCount.length < eventNodeCount.length) {
          toast.error("Drag an action!");
          setIsSaveModalOpen(false);
          return;
        }

        //updating label of emailNodes before saving the flow
        const updatedFlow = flow.nodes.map((item) => {
          const matchningItem = emailData.find((email) => email.id === item.id);
          if (matchningItem) {
            return { ...item, label: matchningItem };
          }
          return item;
        });
        flow.nodes = updatedFlow;
        console.log("updatedFlow: ", flow);

        let hasEmailData = false;
        for (const node of flow.nodes) {
          if (node.type === "emailNode") {
            if (Object.keys(node.label).length !== 0) {
              // console.log("obj length: ", Object.keys(node.label).length);
              hasEmailData = true;
            } else {
              hasEmailData = false;
              break; // Exit the loop if any emailNode has an empty label
            }
          }
        }
        if (!hasEmailData) {
          toast.error("Email id and message is required!");
          setIsSaveModalOpen(false);

          return;
        }

        console.log("SavedFlow: ", JSON.stringify(flow));
        localStorage.setItem(flowKey, JSON.stringify(flow));
        localStorage.setItem("edgeCount", edgeCount);
        setIsSaveModalOpen(false);
        setFlowActivator(true);
        toast.success("Flow saved.");
      }
    }
  }, [
    reactFlowInstance,
    eventData,
    edges,
    edgeCount,
    emailData,
    nodes,
    onNodesChange,
  ]);

  // restoring reactflow after re render
  const onRestore = useCallback(() => {
    const restoreFlow = () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      console.log("Restored flow: ", flow);

      if (!flow) {
        toast.error("No data found.");
        setIsRestoreModalOpen(false);
        return;
      }

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });

        setIsRestoreModalOpen(false);
        toast.success("Flow restored.");
        setActionDraggable(true);
        setFlowActivator(true);
      }
      // console.log(typeof localStorage.getItem("edgeCount"));
      dispatch(setEdgeCount(parseInt(localStorage.getItem("edgeCount"))));
    };
    restoreFlow();
  }, [
    setNodes,
    setViewport,
    setEdges,
    dispatch,
    edges,
    nodes,
    setEdgeCount,
    edgeCount,
    emailData,
  ]);

  //Function to activate flow
  let emailNodeIndex = 0;
  let submitNodeIndex = 0;
  let updateNodeIndex = 0;
  const flowData = JSON.parse(localStorage.getItem(flowKey));
  const emailNodeArray = [];
  const formSubmitNodeArray = [];
  const formUpdateArray = [];

  if (flowData) {
    for (const node of flowData.nodes) {
      if (node.type === "emailNode") {
        emailNodeArray.push(node);
      }
      if (node.type === "formSubmitNode") {
        formSubmitNodeArray.push(node);
      }
      if (node.type === "formUpdateNode") {
        formUpdateArray.push(node);
      }
    }
  }

  const timeOut = () => {
    if (addToCart) {
      if (!removeJourneyState) {
        // console.log("length", emailNodeArray.length);
        // console.log("emailData: ", emailNodeArray);
        if (emailNodeIndex < emailNodeArray.length) {
          // console.log("Data logged: ", emailNodeArray[currIndex]);
          // console.log(formUpdateArray);
          if (!formSubmitted) {
            nodeTypeChange(emailNodeArray[emailNodeIndex].id, "emailSentNode");
            nodeTypeChange(
              formSubmitNodeArray[submitNodeIndex].id,
              "formNotSubmittedNode"
            );
            emailNodeIndex+=2;
            submitNodeIndex++;
            updateNodeIndex++;
            toast.success("Email sent!");
            if (emailNodeIndex === emailNodeArray.length) {
              clearInterval(intervalIdRef.current);
              setIntervalState(false);
              toast.success("Flow completed!");
              return;
            }
          }
          if (formSubmitted) {
            nodeTypeChange(
              formSubmitNodeArray[submitNodeIndex].id,
              "formSubmittedNode"
            );
            emailNodeIndex++;
            if (!formUpdated) {
              nodeTypeChange(
                emailNodeArray[emailNodeIndex].id,
                "emailSentNode"
              );
              nodeTypeChange(
                formUpdateArray[updateNodeIndex].id,
                "formNotUpdatedNode"
              );
              emailNodeIndex++;
              updateNodeIndex++;
              toast.success("Email sent!");
              toast.success("Flow completed!");
              clearInterval(intervalIdRef.current);
              setIntervalState(false);
              return;
            } else {
              nodeTypeChange(
                formUpdateArray[updateNodeIndex].id,
                "formUpdatedNode"
              );
              clearInterval(intervalIdRef.current);
              setIntervalState(false);
              toast.success("Flow completed!");
            }
          }

          if (emailNodeIndex === emailNodeArray.length) {
            clearInterval(intervalIdRef.current);
            setIntervalState(false);
            toast.success("Flow completed!");
          }
        } else {
          clearInterval(intervalIdRef.current);
          setIntervalState(false);
          toast.success("Flow completed!");
        }
      } else {
        clearInterval(intervalIdRef.current);
        setIntervalState(false);
        toast.error("Removed from journey!");
      }
    } else {
      clearInterval(intervalIdRef.current);
      setIntervalState(false);
      toast.error("Can't start flow!");
    }
  }

  
  useEffect(() => {
    if (intervalState) {
      if (!flowData) {
        setIntervalState(false);
        toast.error("Create a flow first!");
      } else {
        intervalIdRef.current = setInterval(timeOut, 5 * 1000);
        nodeTypeReChange();
        toast.success("Flow started!");
      }

      return () => {
        clearInterval(intervalIdRef.current);
        setIntervalState(false);
      };
    }
  }, [intervalState]);

  useEffect(() => {
    const flowInstance = reactFlowInstance?.toObject();
    // console.log(flowData?.nodes.length < flowInstance?.nodes.length);
    if (
      flowData?.nodes.length !== flowInstance?.nodes.length ||
      flowData?.edges.length !== flowInstance?.edges.length
    ) {
      setFlowActivator(false);
    }
    //
  }, [reactFlowInstance, flowActivator, newNodeCreater, nodes, edges]);

  //Context menu for nodes
  // const onContextMenu = (e) => {
  //   console.log(e.target);
  //   e.preventDefault();
  //   setContextMenuPosition({ x: e.clientX, y: e.clientY });
  //   setIsContextMenuOpen(true);
  // };
  const nodeTypeChange = useCallback(
    (id, type) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          node.type = type;
        }
        return node;
      });
      // console.log(updatedNodes);
      setNodes(updatedNodes);
    },
    [nodes]
  );
  const nodeTypeReChange = useCallback(() => {
    const updatedNodes = nodes.map((node) => {
      if (node.type === "emailSentNode") {
        node.type = "emailNode";
      }
      if (
        node.type === "formUpdatedNode" ||
        node.type === "formNotUpdatedNode"
      ) {
        node.type = "formUpdateNode";
      }
      if(node.type === "formSubmittedNode" ||
      node.type === "formNotSubmittedNode"){
        node.type = "formSubmitNode"
      }
      return node;
    });
    setNodes(updatedNodes);
  }, [nodes]);

  return (
    <div className="h-[100vh] md:flex md:flex-row">
      <div>
        <Toaster
          toastOptions={{
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
      <ReactFlowProvider>
        <div className="md:w-[25%] h-[15%] p-0 md:p-4 border-r-8 border-[#519295] ">
          <Triggers
            actionDraggable={actionDraggable}
            intervalState={intervalState}
          />
          <Actions
            actionDraggable={actionDraggable}
            emailDraggable={emailDraggable}
            intervalState={intervalState}
          />
        </div>
        <div
          className="flex-0 h-[75%] md:h-full md:flex-1 bg-blue-50 "
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            // onNodeContextMenu={onContextMenu}
          >
            {/* <ContextMenu
              isContextMenuOpen={isContextMenuOpen}
              onMouseLeave={() => setIsContextMenuOpen(false)}
            /> */}
            <Background variant="cross" color="#babab8" />
            <Controls />
            <MiniMap zoomable pannable />
            <Panel position="top-right" className="flex gap-3">
              {!intervalState ? (
                <>
                  <button
                    onClick={showSaveModal}
                    className="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
                  >
                    Save Flow
                  </button>
                  <Modal
                    title="Are you sure you want to save ?"
                    open={isSaveModalOpen}
                    onOk={onSave}
                    onCancel={handleSaveCancel}
                    okType="default"
                  ></Modal>
                </>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed px-4 py-3 bg-gray-400 rounded-md text-white outline-none  shadow-lg mx-5 flex"
                >
                  Save Flow
                </button>
              )}

              {!intervalState ? (
                <>
                  <button
                    onClick={showRestoreModal}
                    className="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
                  >
                    Restore
                  </button>
                  <Modal
                    title="Restore previous flow ?"
                    open={isRestoreModalOpen}
                    onOk={onRestore}
                    onCancel={handleRestoreCancel}
                    okType="default"
                  ></Modal>
                </>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed px-4 py-3 bg-gray-400 rounded-md text-white outline-none shadow-lg mx-5 flex"
                >
                  Restore
                </button>
              )}
              {flowActivator ? (
                <button
                  className="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
                  onClick={() => setIntervalState(true)}
                >
                  {intervalState ? "Flow Running..." : "Activate Flow"}
                </button>
              ) : (
                <button className="cursor-not-allowed px-4 py-3 bg-gray-400 rounded-md text-white outline-none shadow-lg  mx-5 flex">
                  Activate Flow
                </button>
              )}
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Flow;
