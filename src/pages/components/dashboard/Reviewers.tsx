import { AssignTypeEnum } from '../../../types';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import Assign from './Assign';

const Reviewers = () => {
  return (
    <DashBoardOverlayLayout type='reviewers'>
      <Assign assignType={AssignTypeEnum.rev} />
    </DashBoardOverlayLayout>
  );
};

export default Reviewers;
