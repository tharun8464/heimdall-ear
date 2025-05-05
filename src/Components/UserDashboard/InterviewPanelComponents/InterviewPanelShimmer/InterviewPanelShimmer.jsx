import { Skeleton } from "@mui/material";
import styles from "./InterviewPanelShimmer.module.css";

const InterviewPanelShimmer = () => {
  return (
    <>
      {/* navbar shimmer */}
      <div className={styles.NavbarShimmer}>
        <div className={styles.LogoWrapper}>
          <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: "6px" }} />
          <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: "6px" }} />
        </div>
        <div className={styles.MenuWrapper}>
          <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: "6px" }} />
          <Skeleton variant="rectangular" width={90} height={20} sx={{ borderRadius: "6px" }} />
        </div>
      </div>
      <div className={styles.Wrapper}>
        {/* webcam shimmer */}
        <div className={styles.WebcamShimmerWrapper}>
          <Skeleton
            sx={{ borderRadius: "8px" }}
            animation={"wave"}
            variant="rectangular"
            width={780}
            height={640}
          />
          <div className={styles.StepsShimmer}>
            <Skeleton
              sx={{ borderRadius: "8px" }}
              animation={"wave"}
              variant="rectangular"
              width={180}
              height={100}
            />
            <Skeleton
              sx={{ borderRadius: "8px" }}
              animation={"wave"}
              variant="rectangular"
              width={180}
              height={100}
            />
            <Skeleton
              sx={{ borderRadius: "8px" }}
              animation={"wave"}
              variant="rectangular"
              width={180}
              height={100}
            />
            <Skeleton
              sx={{ borderRadius: "8px" }}
              animation={"wave"}
              variant="rectangular"
              width={180}
              height={100}
            />
          </div>
        </div>
        {/* sidebar shimmer */}
        <div className={styles.SidebarShimmer}>
          <div className="flex gap-2 items-center">
            <Skeleton animation={"wave"} variant="circular" width={25} height={25} />
            <Skeleton
              sx={{ borderRadius: "6px" }}
              animation={"wave"}
              variant="rectangular"
              width={150}
              height={15}
            />
          </div>
          <Skeleton
            sx={{ borderRadius: "8px" }}
            animation={"wave"}
            variant="rectangular"
            width={250}
            height={119}
          />
          <div className="flex gap-2 items-center">
            <Skeleton animation={"wave"} variant="circular" width={25} height={25} />
            <Skeleton
              sx={{ borderRadius: "6px" }}
              animation={"wave"}
              variant="rectangular"
              width={150}
              height={15}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton animation={"wave"} variant="circular" width={25} height={25} />
            <Skeleton
              sx={{ borderRadius: "6px" }}
              animation={"wave"}
              variant="rectangular"
              width={150}
              height={15}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton animation={"wave"} variant="circular" width={25} height={25} />
            <Skeleton
              sx={{ borderRadius: "6px" }}
              animation={"wave"}
              variant="rectangular"
              width={150}
              height={15}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewPanelShimmer;
