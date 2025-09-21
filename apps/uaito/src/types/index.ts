export interface RIDBProps {
  sections: Array<{
    level: number;
    title: string;
    content: string;
  }>;
  structuredMenu: Array<{
    title: string;
    level: number;
    subMenus?: any[];
  }>;
  showMenu?: boolean;
}
