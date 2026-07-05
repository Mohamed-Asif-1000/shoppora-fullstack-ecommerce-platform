type StatCard = {
  label: string;
  value: string;
  color: string;
};

type Props = {
  stats: StatCard[];
};

export default function DeliveryStats({ stats }: Props): React.JSX.Element {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 md:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-linear-to-br ${stat.color} rounded-xl p-4 text-white sm:p-6`}
        >
          <p className="mb-2 text-sm opacity-90">{stat.label}</p>
          <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
