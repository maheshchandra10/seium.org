import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

function BlockItem({
  id,
  coffeeBreak,
  startTime,
  endTime,
  activityType,
  summary,
  author,
  description,
  focused,
  location,
  detailed,
  hyperlink,
}) {
  const skipLink = coffeeBreak || focused;

  const block = (
    <div
      id={`B${id}`}
      className={`mx-2 h-full border-t-2 border-white p-2 ${styles.gridBlock}`}
    >
      {coffeeBreak && (
        <div className="relative float-right mr-5 h-10 w-10">
          <Image src="/images/Coffee.svg" layout="fill" alt="Coffee Break" />
        </div>
      )}

      {!coffeeBreak && (
        <p className="text-l font-ibold text-white xs:text-xl">
          {startTime}-{endTime}
        </p>
      )}

      <p className={`font-iregular text-xl text-white`}>
        <span className="font-ibold">{`${activityType} `}</span>
        {summary}
      </p>

      <ul
        className={`${styles.authors} flex font-iregular text-sm text-gray-400`}
      >
        {author && (
          <li className={styles.listElem}>
            <Link href={`speakers?speaker=${author}`} className={styles.author}>
              {author}
            </Link>
          </li>
        )}
      </ul>

      {description && (
        <div
          className={styles.description}
          style={{ display: focused ? "block" : "none" }}
        >
          {description.split("\n").map((text, i) => (
            <p key={i} className={`mb-2 font-iregular text-lg text-white`}>
              {text}
            </p>
          ))}
        </div>
      )}

      {!coffeeBreak && <div className="h-20 w-2"></div>}
      {!coffeeBreak && (
        <div className="absolute bottom-0 mt-auto w-full py-3">
          <div className="flex flex-wrap justify-center">
            <div className="flex w-auto items-center">
              <p className="float-right font-iregular text-sm text-gray-400">
                {location}
              </p>
            </div>
            <div className="float-right mr-5 flex flex-1 items-center justify-end">
              {hyperlink !== undefined && (
                <a
                  href={hyperlink}
                  target="_blank"
                  className={`${styles.hyperlink} -mr-3 font-iregular text-lg text-quinary sm:mr-1`}
                  rel="noreferrer"
                >
                  Enroll
                </a>
              )}
            </div>
            <div className="mr-5 w-auto">
              {description &&
                detailed &&
                (focused ? (
                  <Link
                    href={{ hash: "_" }}
                    className={`mx-auto ${styles.expand}`}
                  >
                    -
                  </Link>
                ) : (
                  <span className={`mx-auto ${styles.expand}`}>+</span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={skipLink ? "" : styles.clickable}>
      {!skipLink && (
        <Link href={`schedule/#${id}`} className="absolute h-full w-full" />
      )}
      {block}
    </div>
  );
}

export default function Block({ date, detailed, elems }) {
  return (
    <div className={`relative z-50 grid md:grid-cols-${elems.length}`}>
      {elems.map((elem, id) => (
        <BlockItem
          key={id}
          id={`${date}-${elem.id}`}
          focused={elem.focused}
          detailed={detailed}
          {...elem.activity}
        />
      ))}
    </div>
  );
}
