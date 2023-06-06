import React, { useState } from 'react';

const TreeNode = ({ node, indent, onToggle, onAddFile, onAddFolder, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onToggle(node.id);
  };

  const handleAddFile = () => {
    const fileName = prompt('Enter the file name:');
    if (fileName) {
      onAddFile(node.id, fileName);
    }
  };

  const handleAddFolder = () => {
    const folderName = prompt('Enter the folder name:');
    if (folderName) {
      onAddFolder(node.id, folderName);
    }
  };

  const handleEdit = () => {
    const newName = prompt('Enter the new name:', node.name);
    if (newName) {
      onEdit(node.id, newName);
    }
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  return (
    <div className="ml-3">
      <div className="d-flex align-items-center">
        <button className="btn btn-link p-0 mr-2" onClick={toggleExpanded}>
          {isExpanded ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />}
        </button>
        <div>
          {node.type === 'folder' ? (
            <i className="far fa-folder mr-2" />
          ) : (
            <i className="far fa-file-alt mr-2" />
          )}
          {node.name}
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              indent={indent + 1}
              onToggle={onToggle}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      <div className="ml-4">
        <button className="btn btn-sm btn-primary mr-1" onClick={handleAddFile}>
          Add File
        </button>
        <button className="btn btn-sm btn-success mr-1" onClick={handleAddFolder}>
          Add Folder
        </button>
        <button className="btn btn-sm btn-secondary mr-1" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

const FolderStructure = ({ data }) => {
  const [treeData, setTreeData] = useState(data);

  const handleToggle = (nodeId) => {
    setTreeData((prevData) => {
      return toggleNodeExpanded(prevData, nodeId);
    });
  };

  const toggleNodeExpanded = (data, nodeId) => {
    return data.map((node) => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      } else if (node.children) {
        return { ...node, children: toggleNodeExpanded(node.children, nodeId) };
      }
      return node;
    });
  };

  const handleAddFile = (parentId, fileName) => {
    setTreeData((prevData) => {
      return addNode(prevData, parentId, { id: generateUniqueId(), name: fileName, type: 'file' });
    });
  };

  const handleAddFolder = (parentId, folderName) => {
    setTreeData((prevData) => {
      return addNode(prevData, parentId, { id: generateUniqueId(), name: folderName, type: 'folder', children: [], expanded: false });
    });
  };

  const addNode = (data, parentId, newNode) => {
    return data.map((node) => {
      if (node.id === parentId && node.type === 'folder') {
        return { ...node, children: [...(node.children || []), newNode] };
      } else if (node.children) {
        return { ...node, children: addNode(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  const handleEdit = (nodeId, newName) => {
    setTreeData((prevData) => {
      return editNode(prevData, nodeId, newName);
    });
  };

  const editNode = (data, nodeId, newName) => {
    return data.map((node) => {
      if (node.id === nodeId) {
        return { ...node, name: newName };
      } else if (node.children) {
        return { ...node, children: editNode(node.children, nodeId, newName) };
      }
      return node;
    });
  };

  const handleDelete = (nodeId) => {
    setTreeData((prevData) => {
      return deleteNode(prevData, nodeId);
    });
  };

  const deleteNode = (data, nodeId) => {
    return data.filter((node) => {
      if (node.id === nodeId) {
        return false;
      } else if (node.children) {
        node.children = deleteNode(node.children, nodeId);
      }
      return true;
    });
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="mt-4">
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          indent={0}
          onToggle={handleToggle}
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

// Usage
const data = [
  {
    id: '1',
    name: 'Folder 1',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'File 1',
        type: 'file',
      },
      {
        id: '3',
        name: 'Folder 2',
        type: 'folder',
        children: [
          {
            id: '4',
            name: 'File 2',
            type: 'file',
          },
        ],
      },
    ],
  },
];

function App() {
  return (
    <div className="container">
      <h1 className="mt-4">Folder Structure</h1>
      <FolderStructure data={data} />
    </div>
  );
}

export default App;
