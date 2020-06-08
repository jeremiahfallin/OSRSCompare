import React, { useState } from "react";
import styled from "styled-components";

const skills = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecraft",
  "Hunter",
  "Construction",
];

const SkillsBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3px;
  width: 400px;
  border: 1px solid black;
`;

const SkillBox = styled.div`
  height: 50px;
  border: 1px solid red;
`;

const OverRS3 = styled.span`
  color: green;
`;

const UnderRS3 = styled.span`
  color: red;
`;

const processData = res => {
  let skillsData = {};
  const allRows = res.split(/\r?\n|\r/);
  for (let skill in skills) {
    const rankLevelExperience = allRows[skill].split(",");
    skillsData[skills[skill]] = {
      rank: rankLevelExperience[0],
      level: rankLevelExperience[1],
      experience: rankLevelExperience[2],
    };
  }

  return skillsData;
};

const Stats = () => {
  const [name, setName] = useState("");
  const [rs3Name, setRs3Name] = useState("");
  const [data, setData] = useState(
    skills.reduce((a, b) => ((a[b] = { osrs: 0, rs3: 0 }), a), {})
  );

  async function getStats(e, parameter, rs3parameter) {
    if (e) {
      e.preventDefault();
    }
    const url = `/.netlify/functions/rsstats`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: parameter,
          rs3name: rs3parameter,
        }),
      }).then(res => res.json());

      return [processData(response.skills), processData(response.rs3skills)];
    } catch (err) {
      console.log(err);
    }
  }

  const compareStats = async () => {
    let rs3StatsName = "";
    if (name) {
      if (rs3Name) {
        rs3StatsName = rs3Name;
      } else {
        rs3StatsName = name;
      }
      const [osrsstats, rs3stats] = await getStats(null, name, rs3StatsName);
      setData(
        skills.reduce(
          (a, b) => (
            (a[b] = {
              osrs: osrsstats[b]["level"],
              rs3: rs3stats[b]["level"],
            }),
            a
          ),
          {}
        )
      );
    }
  };

  return (
    <div>
      <div>
        <span>OSRS Name: </span>
        <div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <span>RS3 Name: </span>
        <div>
          <input
            type="text"
            value={rs3Name}
            onChange={e => setRs3Name(e.target.value)}
          />
        </div>
      </div>
      <button onClick={e => compareStats(e)}>Compare OSRS to RS3!</button>
      <SkillsBox>
        {skills.map(skill => {
          if (data && data.Attack && data.Attack.osrs) {
            return (
              <SkillBox key={skill}>
                {skill}{" "}
                {data[skill]["osrs"] > data[skill]["rs3"] ? (
                  <OverRS3>
                    {data[skill]["osrs"]}/{data[skill]["rs3"]}
                  </OverRS3>
                ) : (
                  <UnderRS3>
                    {data[skill]["osrs"]}/{data[skill]["rs3"]}
                  </UnderRS3>
                )}
              </SkillBox>
            );
          } else {
            return <SkillBox key={skill}>{skill}</SkillBox>;
          }
        })}
      </SkillsBox>
    </div>
  );
};

export default Stats;
