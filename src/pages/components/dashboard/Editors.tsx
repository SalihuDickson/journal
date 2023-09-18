import { AssignTypeEnum } from '../../../types';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import Assign from './Assign';

const Reviewers = () => {
  return (
    <DashBoardOverlayLayout type='editors'>
      <Assign assignType={AssignTypeEnum.edi} />
    </DashBoardOverlayLayout>
  );
};

export default Reviewers;
