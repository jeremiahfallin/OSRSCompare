import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";

import quests from "../data/quests";

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
  "Combat",
];

const QuestSpan = styled.span`
  color: ${props => props.status};
`;

const QuestStyle = styled.div`
  ul {
    list-style: none;
    margin-bottom: 0;
  }
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
  const meleeCombatLevel = Math.floor(
    0.25 *
      (skillsData["defence"] +
        skillsData["hitpoints"] +
        Math.floor(skillsData["prayer"] / 2)) +
      0.325 * (skillsData["attack"] + skillsData["strength"])
  );

  const rangedCombatLevel = Math.floor(
    0.25 *
      (skillsData["defence"] +
        skillsData["hitpoints"] +
        Math.floor(skillsData["prayer"] / 2)) +
      0.325 * Math.floor((3 * skillsData["ranged"]) / 2)
  );

  const magicCombatLevel = Math.floor(
    0.25 *
      (skillsData["defence"] +
        skillsData["hitpoints"] +
        Math.floor(skillsData["prayer"] / 2)) +
      0.325 * Math.floor((3 * skillsData["magic"]) / 2)
  );

  skillsData["Combat"]["level"] = Math.max(
    meleeCombatLevel,
    rangedCombatLevel,
    magicCombatLevel
  );

  return skillsData;
};

const PlayerNameInput = ({ setData }) => {
  const [name, setName] = useState("");

  async function getStats(e, parameter) {
    if (e) {
      e.preventDefault();
    }
    const url = `/.netlify/functions/osrsstats`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: parameter,
        }),
      }).then(res => res.json());
      return processData(response.skills);
    } catch (err) {
      console.log(err);
    }
  }

  const setStats = async () => {
    if (name) {
      const osrsstats = await getStats(null, name);
      setData(
        skills.reduce(
          (a, b) => (
            (a[b] = {
              osrs: osrsstats[b]["level"],
            }),
            a
          ),
          {}
        )
      );
    }
  };
  return (
    <>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={e => setStats(e)}>Get Stats.</button>
    </>
  );
};

const getQuestStatus = quest => {
  if (quest.completed) {
    return "green";
  } else if (hasRequiredQuests(quest) && hasRequiredSkills(quest)) {
    return "black";
  } else {
    return "red";
  }
};

const QuestList = ({ playerQuests, quest }) => {
  // This takes forever to run.
  return (
    <ul>
      {quest.requiredQuests.map((q, i) => {
        const requiredQuest = playerQuests[getQuestIndexFromName(q)];
        return (
          <React.Fragment key={i}>
            <QuestListItem quest={requiredQuest} key={requiredQuest.name} />
            {requiredQuest.requiredQuests && (
              <QuestList quest={requiredQuest} />
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

const QuestListItem = ({ quest }) => {
  const markQuestCompletion = quest => {
    let questChange = [...playerQuests];

    questChange[getQuestIndexFromName(quest.name)]["completed"] = !quest[
      "completed"
    ];

    for (let q in quest.requiredQuests) {
      const rqi = getQuestIndexFromName(quest.requiredQuests[q]);
      if (playerQuests[rqi].completed === false) {
        markQuestCompletion(playerQuests[rqi]);
      }
    }

    setPlayerQuests([...questChange]);
  };
  return (
    <li>
      <label className="container">
        <QuestSpan status={getQuestStatus(quest)}>{quest.name}</QuestSpan>
        <input
          type="checkbox"
          checked={quest.completed}
          onChange={e => markQuestCompletion(quest)}
        />
        <span className="checkmark" />
      </label>
    </li>
  );
};

const getQuestIndexFromName = questName => {
  const questIndex = quests.findIndex(x => x.name === questName);
  if (questIndex !== -1) {
    return questIndex;
  }
};

const Quests = () => {
  const [data, setData] = useState(
    skills.reduce((a, b) => ((a[b] = { osrs: 0 }), a), {})
  );
  const [playerQuests, setPlayerQuests] = useState(quests);

  const hasRequiredSkills = quest => {
    for (let s in quest.skills) {
      const skill = s.charAt(0).toUpperCase() + s.slice(1);
      if (Number(data[skill]["osrs"]) < Number(quest.skills[s])) {
        return false;
      }
    }
    return true;
  };

  const hasRequiredQuests = quest => {
    let reqIndex;
    for (let q in quest["requiredQuests"]) {
      reqIndex = playerQuests.findIndex(
        x => x.name === quest["requiredQuests"][q]
      );
      if (playerQuests[reqIndex].completed === false) {
        return false;
      }
    }

    return true;
  };

  return (
    <QuestStyle>
      <PlayerNameInput setData={setData} />
      <ul>
        Non members
        {quests
          .filter(q => q.members === false)
          .map((quest, i) => {
            return <QuestListItem quest={quest} key={quest.name} />;
          })}
      </ul>
      Members:
      <ul>
        {quests
          .filter(quest => quest.members === true)
          .map((quest, i) => {
            return (
              <React.Fragment key={quest.name}>
                <QuestListItem quest={quest} key={quest.name} />
                {quest.requiredQuests && (
                  <QuestList playerQuests={playerQuests} quest={quest} />
                )}
              </React.Fragment>
            );
          })}
      </ul>
    </QuestStyle>
  );
};

export default Quests;
