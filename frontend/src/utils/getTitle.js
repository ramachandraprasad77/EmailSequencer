export const getTitle = (type) => {
    switch (type) {
      case "leadSource": return "1. Lead Source Configuration";
      case "email": return "2. Email Step Configuration";
      case "delay": return "3. Delay Step Configuration";
      default: return "Node Settings";
    }
  };