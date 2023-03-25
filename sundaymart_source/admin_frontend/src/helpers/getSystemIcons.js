import {
  PieChartOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
  AppstoreOutlined,
  LaptopOutlined,
  GoldOutlined,
  SettingOutlined,
  GlobalOutlined,
  MoneyCollectOutlined,
  DropboxOutlined,
  BranchesOutlined,
  UserOutlined,
  UserSwitchOutlined,
  UserAddOutlined,
  CalendarOutlined,
  EuroCircleOutlined,
  TranslationOutlined,
  ProjectOutlined,
  DatabaseOutlined,
  ToolOutlined,
  DisconnectOutlined,
  OrderedListOutlined,
  FormOutlined,
  WalletOutlined,
  UsergroupAddOutlined,
  QuestionCircleOutlined,
  TransactionOutlined,
  MessageOutlined,
  LockOutlined,
  PaperClipOutlined,
  StarOutlined,
  SkinOutlined,
  BookOutlined,
  CloudUploadOutlined,
  FireOutlined,
  DollarOutlined,
  TrophyOutlined,
  InstagramOutlined,
  CopyrightOutlined,
  LogoutOutlined,
  GroupOutlined,
  GiftOutlined,
  BarChartOutlined,
  FundViewOutlined,
  RiseOutlined,
  RadarChartOutlined,
  BoxPlotOutlined,
  SlidersOutlined,
  StockOutlined,
} from '@ant-design/icons';
import { FiImage, FiShoppingCart } from 'react-icons/fi';
import { BsImage } from 'react-icons/bs';
import {
  MdOutlineDeliveryDining,
  MdOutlineNotificationsActive,
} from 'react-icons/md';
import { ImSubscript2 } from 'react-icons/im';

export default function getSystemIcons(icon) {
  switch (icon) {
    case 'dashboard':
      return <PieChartOutlined />;
    case 'shop':
      return <ShopOutlined />;
    case 'gold':
      return <GoldOutlined />;
    case 'dropbox':
      return <DropboxOutlined />;
    case 'appStoreAdd':
      return <AppstoreAddOutlined />;
    case 'branchesOutlined':
      return <BranchesOutlined />;
    case 'payments':
      return <BranchesOutlined />;
    case 'laptop':
      return <LaptopOutlined />;
    case 'appStore':
      return <AppstoreOutlined />;
    case 'settings':
      return <SettingOutlined />;
    case 'global':
      return <GlobalOutlined />;
    case 'moneyCollect':
      return <MoneyCollectOutlined />;
    case 'branches':
      return <BranchesOutlined />;
    case 'user':
      return <UserOutlined />;
    case 'userSwitch':
      return <UserSwitchOutlined />;
    case 'userAdd':
      return <UserAddOutlined />;
    case 'calendar':
      return <CalendarOutlined />;
    case 'euroCircle':
      return <EuroCircleOutlined />;
    case 'translation':
      return <TranslationOutlined />;
    case 'project':
      return <ProjectOutlined />;
    case 'database':
      return <DatabaseOutlined />;
    case 'tool':
      return <ToolOutlined />;
    case 'disconnect':
      return <DisconnectOutlined />;
    case 'orderedList':
      return <OrderedListOutlined />;
    case 'form':
      return <FormOutlined />;
    case 'wallet':
      return <WalletOutlined />;
    case 'userGroupAdd':
      return <UsergroupAddOutlined />;
    case 'questionCircle':
      return <QuestionCircleOutlined />;
    case 'transaction':
      return <TransactionOutlined />;
    case 'fiShoppingCart':
      return <FiShoppingCart />;
    case 'fiImage':
      return <FiImage />;
    case 'bsImage':
      return <BsImage />;
    case 'deliveryDining':
      return <MdOutlineDeliveryDining />;
    case 'notificationsActive':
      return <MdOutlineNotificationsActive />;
    case 'imSubscript':
      return <ImSubscript2 />;
    case 'message':
      return <MessageOutlined />;
    case 'lock':
      return <LockOutlined />;
    case 'paperClip':
      return <PaperClipOutlined />;
    case 'star':
      return <StarOutlined />;
    case 'skin':
      return <SkinOutlined />;
    case 'book':
      return <BookOutlined />;
    case 'cloudUpload':
      return <CloudUploadOutlined />;
    case 'fire':
      return <FireOutlined />;
    case 'dollar':
      return <DollarOutlined />;
    case 'trophy':
      return <TrophyOutlined />;
    case 'instagram':
      return <InstagramOutlined />;
    case 'copyright':
      return <CopyrightOutlined />;
    case 'logout':
      return <LogoutOutlined />;
    case 'GrCatalog':
      return <GroupOutlined />;
    case 'GiftOutlined':
      return <GiftOutlined />;
    case 'report':
      return <BarChartOutlined />;
    case 'overview':
      return <FundViewOutlined />;
    case 'products':
      return <DropboxOutlined />;
    case 'revenue':
      return <RiseOutlined />;
    case 'orders':
      return <RadarChartOutlined />;
    case 'variation':
      return <BoxPlotOutlined />;
    case 'categories':
      return <SlidersOutlined />;
    case 'stock':
      return <StockOutlined />;
    default:
      break;
  }
}
